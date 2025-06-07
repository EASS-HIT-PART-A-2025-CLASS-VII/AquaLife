from models.ai_model import AquariumLayout as AquariumLayoutRequest

def build_prompt(layout: AquariumLayoutRequest) -> str:
    """
    Build a prompt for the AI model based on the aquarium layout.
    
    Args:
        layout: AquariumLayoutRequest model containing all aquarium details
        
    Returns:
        str: Formatted prompt string
    """
    # Format fish data with quantities
    fish_list = ", ".join(f"{fish.quantity} {fish.name}" for fish in layout.fish_data)
    total_fish = sum(fish.quantity for fish in layout.fish_data)
    
    # Pre-calculate tank metrics
    volume_cubic_inches = layout.tank_length * layout.tank_width * layout.tank_height
    volume_gallons = round(volume_cubic_inches / 231, 1)
    volume_liters = round(volume_gallons * 3.785, 1)
    estimated_capacity = int(volume_gallons * 0.8)
    
    return f"""Analyze this aquarium setup:

Tank: {layout.tank_name}
Size: {layout.tank_length}" x {layout.tank_width}" x {layout.tank_height}"
Volume: {volume_gallons} gallons ({volume_liters} liters)
Water: {layout.water_type}
Estimated capacity: {estimated_capacity} inches of fish

Current fish: {fish_list} (total: {total_fish} fish)

Please evaluate:
1. Tank volume is correct at {volume_gallons} gallons
2. Current bioload vs capacity  
3. Fish compatibility and behavior
4. Any schooling requirements
5. Recommendations
6. Overall rating 1-10

{f"Notes: {layout.comments}" if layout.comments else ""}

Provide a concise professional assessment."""
