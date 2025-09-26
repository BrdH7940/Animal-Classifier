import pytest
from services.user_service.app import create_app

@pytest.fixture
def client():
    """Create a test client for the user service."""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_user_service_health(client):
    """Test the health check endpoint of the user service."""
    response = client.get('/api/users/health')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['status'] == 'healthy'
    assert json_data['service'] == 'user_service'
