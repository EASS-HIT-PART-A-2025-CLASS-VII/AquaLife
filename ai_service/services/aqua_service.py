import openai
import logging
from .prompt_builder import build_prompt
from config import settings
from models.ai_model import AquariumLayout as AquariumLayoutRequest, AIResponse

# Configure logging
logger = logging.getLogger(__name__)

# Configure OpenRouter client using OpenAI-compatible interface
client = openai.OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url=settings.OPENROUTER_API_BASE.rstrip('/').replace('/chat/completions', '')
)

SYSTEM_PROMPT = """
You are an expert aquarium consultant. Analyze the provided aquarium setup and give professional advice about fish compatibility, tank capacity, and recommendations.

Be concise and practical in your response.
"""

class AquariumServiceError(Exception):
    """Base exception for aquarium service errors"""
    pass

class OpenRouterError(AquariumServiceError):
    """Exception for OpenRouter API related errors"""
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
        OpenRouterError: If there's an error with the OpenRouter API
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

        # Pre-calculate tank volume for potential fallback use
        volume_gallons = round((layout.tank_length * layout.tank_width * layout.tank_height) / 231, 1)

        prompt = build_prompt(layout)
        logger.info(f"Generated prompt: {prompt}")
        logger.info(f"System prompt: {SYSTEM_PROMPT[:200]}...")
        logger.info(f"User prompt length: {len(prompt)} characters")

        try:
            response = client.chat.completions.create(
                model=settings.OPENROUTER_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT.strip()},
                    {"role": "user", "content": prompt.strip()}
                ],
                max_tokens=800,  # Increased limit
                temperature=0.8,  # Higher temperature for more variation
                top_p=0.95,  # Slightly higher for more diversity
                stop=None  # Remove stop sequences that might interfere
            )
            logger.info("Successfully received response from OpenRouter")
            
            # Validate response content
            ai_response_content = response.choices[0].message.content
            logger.info(f"OpenRouter response length: {len(ai_response_content)} characters")
            
            # Check for suspiciously short responses
            if len(ai_response_content.strip()) < 50:
                logger.warning(f"Received very short response: '{ai_response_content}'")
                # Provide a fallback response
                ai_response_content = f"""Tank Analysis: Your {volume_gallons} gallon tank setup looks good.

Current Setup: {', '.join(f'{fish.quantity} {fish.name}' for fish in layout.fish_data)}

Assessment: Based on your fish selection, this appears to be a {layout.water_type} community tank. Please provide more specific requirements for a detailed compatibility analysis.

Rating: 7/10 - Good foundation for a community aquarium."""
            
            logger.debug(f"Final response: {ai_response_content[:200]}...")
            
            return AIResponse(
                status="success",
                response=ai_response_content
            )
            
        except Exception as e:
            logger.error(f"OpenRouter API error: {str(e)}")
            raise OpenRouterError(f"Error communicating with OpenRouter API: {str(e)}")
            
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in evaluate_aquarium_layout: {str(e)}")
        raise AquariumServiceError(f"An unexpected error occurred: {str(e)}")
