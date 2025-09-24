import pytest
from services.prediction_service.ai_service import create_app

@pytest.fixture
def client():
    """Create a test client for the prediction service."""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_prediction_service_health(client):
    """Test the health check endpoint of the prediction service."""
    response = client.get('/api/health')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['status'] == 'healthy'
    assert json_data['model_loaded'] is True
