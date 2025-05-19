import openai
import logging
from .prompt_builder import build_prompt
from config import settings
from models.ai_model import AquariumLayout as AquariumLayoutRequest, AIResponse

# Configure logging
logger = logging.getLogger(__name__)

# Configure OpenAI client
client = openai.OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_API_BASE.rstrip('/')
)

SYSTEM_PROMPT = """
You are an intelligent aquarium design assistant. The user provides the tank dimensions and whether the aquarium is freshwater or saltwater. As the user selects fish from a catalog, you must:

- Calculate and track total tank capacity used (in gallons or liters).
- Check compatibility of selected fish based on aggression levels, environmental needs (pH, temperature, water type), and behavior.
- Warn if fish are incompatible or if tank capacity is exceeded.
- Provide brief reasoning for compatibility results.
- Allow the user to continue adding or removing fish and update calculations accordingly.
- Make recommendations if problems arise.
"""

class AquariumServiceError(Exception):
    """Base exception for aquarium service errors"""
    pass

class OpenAIError(AquariumServiceError):
    """Exception for OpenAI API related errors"""
    pass

class ValidationError(AquariumServiceError):
    """Exception for input validation errors"""
    pass

async def evaluate_aquarium_layout(layout: AquariumLayoutRequest) -> AIResponse:
    """
    Evaluate an aquarium layout and provide AI advice.
    
    Args:
        layout: AquariumLayoutRequest model containing all aquarium details
        
    Returns:
        AIResponse containing the AI's evaluation
        
    Raises:
        ValidationError: If input data is invalid
        OpenAIError: If there's an error with the OpenAI API
        AquariumServiceError: For other service-related errors
    """
    try:
        logger.info(f"Evaluating aquarium layout for owner: {layout.owner_email}")
        
        # Validate input
        if not layout.tank_length or not layout.tank_width or not layout.tank_height:
            raise ValidationError("Tank dimensions must be provided")
        if not layout.water_type or layout.water_type not in ["freshwater", "saltwater"]:
            raise ValidationError("Water type must be either 'freshwater' or 'saltwater'")
        if not layout.fish_data:
            raise ValidationError("Fish data cannot be empty")

        prompt = build_prompt(layout)
        logger.debug(f"Generated prompt: {prompt}")

        try:
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT.strip()},
                    {"role": "user", "content": prompt.strip()}
                ],
                temperature=0.5
            )
            logger.info("Successfully received response from OpenAI")
            logger.debug(f"OpenAI response: {response.choices[0].message.content}")
            
            return AIResponse(
                status="success",
                response=response.choices[0].message.content
            )
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise OpenAIError(f"Error communicating with OpenAI API: {str(e)}")
            
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in evaluate_aquarium_layout: {str(e)}")
        raise AquariumServiceError(f"An unexpected error occurred: {str(e)}")
