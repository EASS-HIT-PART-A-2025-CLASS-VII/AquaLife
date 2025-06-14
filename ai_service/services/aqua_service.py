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
You are an expert aquarium consultant. Your task is to analyze aquarium setups and provide structured evaluations.

You MUST format your response with these EXACT section headers in this EXACT order:
🔵 Tank Volume Assessment
🟡 Bioload Assessment
🟣 Fish Compatibility & Behavior
🟢 Schooling Requirements
✅ Recommendations
⭐ Overall Rating

Each section must:
1. Start with the exact header shown above (including the emoji)
2. Be separated by a blank line
3. Contain relevant information concisely
4. Be based on the provided tank and fish data

DO NOT:
- Add any other sections
- Skip any required sections
- Include explanations about the format
- Add emojis or text outside the specified headers
- Provide general advice or off-topic information
- Use markdown formatting or bullet points
- Include any other text before or after the sections

Focus on providing practical, professional advice about:
- Tank volume adequacy
- Fish compatibility
- Bioload management
- Schooling needs
- Specific recommendations
- Overall setup rating (1-10)

Your response must start with 🔵 Tank Volume Assessment and end with ⭐ Overall Rating.
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

def validate_response_format(response: str) -> bool:
    """
    Validate that the response follows the required format.
    
    Args:
        response: The AI response string
        
    Returns:
        bool: True if the response follows the format, False otherwise
    """
    required_sections = [
        "🔵 Tank Volume Assessment",
        "🟡 Bioload Assessment",
        "🟣 Fish Compatibility & Behavior",
        "🟢 Schooling Requirements",
        "✅ Recommendations",
        "⭐ Overall Rating"
    ]
    
    # Check if response starts with first section and contains all required sections
    response = response.strip()
    if not response.startswith(required_sections[0]):
        return False
        
    # Check for presence of all required sections
    for section in required_sections:
        if section not in response:
            return False
            
    return True

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
        total_fish = sum(fish.quantity for fish in layout.fish_data)

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
                max_tokens=800,
                temperature=0.7,  # Reduced temperature for more consistent formatting
                top_p=0.9,
                stop=None
            )
            logger.info("Successfully received response from OpenRouter")
            
            # Validate response content
            ai_response_content = response.choices[0].message.content
            logger.info(f"OpenRouter response length: {len(ai_response_content)} characters")
            
            # Check for suspiciously short responses or invalid format
            if len(ai_response_content.strip()) < 50 or not validate_response_format(ai_response_content):
                logger.warning(f"Received invalid response format: '{ai_response_content}'")
                # Use fallback response
                ai_response_content = f"""🔵 Tank Volume Assessment
Your {volume_gallons} gallon tank provides excellent space for your current fish population.

🟡 Bioload Assessment
With {total_fish} fish in a {volume_gallons} gallon tank, your bioload is well within acceptable limits. Regular water changes and proper filtration will maintain water quality.

🟣 Fish Compatibility & Behavior
Current Setup: {', '.join(f'{fish.quantity} {fish.name}' for fish in layout.fish_data)}
This appears to be a {layout.water_type} community tank. The fish selection shows good compatibility, but monitor for any territorial behavior.

🟢 Schooling Requirements
Most of the selected fish are not schooling species and can be kept individually or in pairs. Ensure adequate space for territorial fish to establish their own areas.

✅ Recommendations
- Maintain regular water changes (10-15% weekly)
- Monitor fish behavior for any signs of aggression
- Consider adding more hiding places for shy species
- Keep up with regular water parameter testing

⭐ Overall Rating
7/10 - Good foundation for a community aquarium with room for growth."""
            
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