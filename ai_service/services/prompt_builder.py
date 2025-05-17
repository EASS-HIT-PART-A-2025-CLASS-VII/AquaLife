from ai_service.models.ai_model import AquariumLayoutRequest

def build_prompt(layout: AquariumLayoutRequest) -> str:
    """
    Build a prompt for the AI model based on the aquarium layout.
    
    Args:
        layout: AquariumLayoutRequest model containing all aquarium details
        
    Returns:
        str: Formatted prompt string
    """
    # Format fish data with quantities
    fish = "\n".join(f"{i+1}. {fish.name} (Quantity: {fish.quantity})" 
                    for i, fish in enumerate(layout.fish_data))

    return f"""
Tank Setup:

Tank Name: {layout.tank_name}
Dimensions: {layout.tank_length} x {layout.tank_width} x {layout.tank_height} inches
Water Type: {layout.water_type.capitalize()}

Fish Selection:
{fish}

Goal: Evaluate fish compatibility and tank load with each selection.
"""
