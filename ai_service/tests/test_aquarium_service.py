import pytest
from unittest.mock import Mock, patch
from ai_service.models.ai_model import AquariumLayoutRequest, FishEntry, AIResponse
from ai_service.services.aqua_service import evaluate_aquarium_layout, OpenRouterError, ValidationError, AquariumServiceError
import openai

# Test data
SAMPLE_FISH_CATALOG = [
    {
        "name": "Neon Tetra",
        "image_url": "https://example.com/fish/neon-tetra.jpg"
    },
    {
        "name": "Betta Fish",
        "image_url": "https://example.com/fish/betta.jpg"
    },
    {
        "name": "Clownfish",
        "image_url": "https://example.com/fish/clownfish.jpg"
    }
]

SAMPLE_AQUARIUM_LAYOUT = {
    "owner_email": "user@example.com",
    "tank_name": "My First Aquarium",
    "tank_length": 60,
    "tank_width": 30,
    "tank_height": 40,
    "water_type": "freshwater",
    "fish_data": [
        {
            "name": "Neon Tetra",
            "quantity": 6
        }
    ],
    "comments": "My first aquarium setup with peaceful community fish"
}

@pytest.fixture
def mock_openrouter_response():
    return Mock(
        choices=[
            Mock(
                message=Mock(
                    content="Based on your tank setup, I recommend starting with 6 Neon Tetras. They are peaceful and will do well in your freshwater setup."
                )
            )
        ]
    )

@pytest.fixture
def sample_aquarium_layout():
    return AquariumLayoutRequest(**SAMPLE_AQUARIUM_LAYOUT)

class TestFishCatalog:
    def test_create_fish_entry(self):
        """Test creating a new fish entry in the catalog"""
        fish_entry = FishEntry(name="Neon Tetra", quantity=6)
        
        assert fish_entry.name == "Neon Tetra"
        assert fish_entry.quantity == 6

    def test_fish_entry_structure(self):
        """Test fish entry structure"""
        fish_entry = FishEntry(name="Neon Tetra", quantity=6)
        assert hasattr(fish_entry, "name")
        assert hasattr(fish_entry, "quantity")

class TestAquariumLayout:
    def test_create_aquarium_layout(self):
        """Test creating a new aquarium layout"""
        layout = AquariumLayoutRequest(**SAMPLE_AQUARIUM_LAYOUT)
        
        assert layout.owner_email == "user@example.com"
        assert layout.tank_name == "My First Aquarium"
        assert layout.tank_length == 60
        assert layout.tank_width == 30
        assert layout.tank_height == 40
        assert layout.water_type == "freshwater"
        assert layout.fish_data[0].name == "Neon Tetra"
        assert layout.fish_data[0].quantity == 6
        assert layout.comments == "My first aquarium setup with peaceful community fish"

    def test_aquarium_layout_structure(self):
        """Test aquarium layout structure"""
        layout = AquariumLayoutRequest(**SAMPLE_AQUARIUM_LAYOUT)
        required_fields = [
            "owner_email",
            "tank_name",
            "tank_length",
            "tank_width",
            "tank_height",
            "water_type",
            "fish_data",
            "comments"
        ]
        for field in required_fields:
            assert hasattr(layout, field)

    def test_fish_data_structure(self):
        """Test fish data structure in aquarium layout"""
        layout = AquariumLayoutRequest(**SAMPLE_AQUARIUM_LAYOUT)
        fish_data = layout.fish_data[0]
        assert isinstance(fish_data, FishEntry)
        assert hasattr(fish_data, "name")
        assert hasattr(fish_data, "quantity")

@pytest.mark.asyncio
class TestAIService:
    @patch('openai.chat.completions.create')
    async def test_initial_fish_recommendation(self, mock_create, mock_openrouter_response, sample_aquarium_layout):
        """Test initial fish recommendation from AI"""
        mock_create.return_value = mock_openrouter_response
        
        response = await evaluate_aquarium_layout(sample_aquarium_layout)
        
        # Verify the correct data is sent to OpenRouter
        mock_create.assert_called_once()
        call_args = mock_create.call_args[1]
        messages = call_args["messages"]
        
        # Verify system message contains the correct prompt
        assert "aquarium design assistant" in messages[0]["content"].lower()
        
        # Verify user message contains the correct data
        user_message = messages[1]["content"]
        assert str(sample_aquarium_layout.tank_length) in user_message
        assert str(sample_aquarium_layout.tank_width) in user_message
        assert str(sample_aquarium_layout.tank_height) in user_message
        assert sample_aquarium_layout.water_type.lower() in user_message.lower()
        assert sample_aquarium_layout.tank_name in user_message
        assert sample_aquarium_layout.fish_data[0].name in user_message
        
        assert response.status == "success"
        assert "Neon Tetra" in response.response

    @patch('openai.chat.completions.create')
    async def test_add_more_fish(self, mock_create, mock_openrouter_response, sample_aquarium_layout):
        """Test adding more fish to the aquarium"""
        # First request
        mock_create.return_value = mock_openrouter_response
        await evaluate_aquarium_layout(sample_aquarium_layout)
        
        # Add more fish
        sample_aquarium_layout.fish_data.append(FishEntry(name="Betta Fish", quantity=1))
        mock_create.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content="I notice you've added a Betta Fish. This might not be compatible with Neon Tetras due to the Betta's aggressive nature."
                    )
                )
            ]
        )
        
        updated_response = await evaluate_aquarium_layout(sample_aquarium_layout)
        
        # Verify the correct data is sent in the second call
        assert mock_create.call_count == 2
        second_call_args = mock_create.call_args[1]
        second_messages = second_call_args["messages"]
        
        # Verify user message contains both fish
        user_message = second_messages[1]["content"]
        assert "Neon Tetra" in user_message
        assert "Betta Fish" in user_message
        
        assert updated_response.status == "success"
        assert "Betta" in updated_response.response

    async def test_invalid_tank_dimensions(self):
        """Test validation of tank dimensions"""
        invalid_layout = AquariumLayoutRequest(
            owner_email="user@example.com",
            tank_name="Invalid Tank",
            tank_length=0,  # Invalid length
            tank_width=30,
            tank_height=40,
            water_type="freshwater",
            fish_data=[FishEntry(name="Neon Tetra", quantity=6)]
        )
        
        with pytest.raises(ValidationError) as exc_info:
            await evaluate_aquarium_layout(invalid_layout)
        
        assert "Tank dimensions must be provided" in str(exc_info.value)

    async def test_invalid_water_type(self):
        """Test validation of water type"""
        invalid_layout = AquariumLayoutRequest(
            owner_email="user@example.com",
            tank_name="Invalid Tank",
            tank_length=60,
            tank_width=30,
            tank_height=40,
            water_type="brackish",  # Invalid water type
            fish_data=[FishEntry(name="Neon Tetra", quantity=6)]
        )
        
        with pytest.raises(ValidationError) as exc_info:
            await evaluate_aquarium_layout(invalid_layout)
        
        assert "Water type must be either 'freshwater' or 'saltwater'" in str(exc_info.value)

    @patch('openai.chat.completions.create')
    async def test_openrouter_error_handling(self, mock_create, sample_aquarium_layout):
        """Test handling of OpenRouter API errors"""
        # Mock the OpenRouter API to raise a specific error
        mock_request = Mock()
        mock_create.side_effect = openai.APIError(
            message="API Error",
            request=mock_request,
            body={"error": {"message": "API Error"}}
        )
        
        with pytest.raises(AquariumServiceError) as exc_info:
            await evaluate_aquarium_layout(sample_aquarium_layout)
        
        assert "An unexpected error occurred" in str(exc_info.value)
        assert "API Error" in str(exc_info.value)

    @patch('openai.chat.completions.create')
    async def test_conversation_context(self, mock_create, sample_aquarium_layout):
        """Test maintaining conversation context with AI"""
        # First request
        mock_create.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content="Starting with 6 Neon Tetras is a good choice for your tank."
                    )
                )
            ]
        )
        await evaluate_aquarium_layout(sample_aquarium_layout)
        
        # Add more fish
        sample_aquarium_layout.fish_data.append(FishEntry(name="Clownfish", quantity=1))
        mock_create.return_value = Mock(
            choices=[
                Mock(
                    message=Mock(
                        content="I notice you're trying to add a Clownfish to a freshwater tank. This won't work as Clownfish require saltwater."
                    )
                )
            ]
        )
        
        updated_response = await evaluate_aquarium_layout(sample_aquarium_layout)
        
        # Verify the correct data is sent in both calls
        assert mock_create.call_count == 2
        second_call_args = mock_create.call_args[1]
        second_messages = second_call_args["messages"]
        
        # Verify user message contains both fish and correct tank info
        user_message = second_messages[1]["content"]
        assert "Neon Tetra" in user_message
        assert "Clownfish" in user_message
        assert str(sample_aquarium_layout.tank_length) in user_message
        assert str(sample_aquarium_layout.tank_width) in user_message
        assert str(sample_aquarium_layout.tank_height) in user_message
        assert sample_aquarium_layout.water_type.lower() in user_message.lower()
        assert sample_aquarium_layout.tank_name in user_message
        
        assert "Clownfish" in updated_response.response
        assert "saltwater" in updated_response.response.lower() 