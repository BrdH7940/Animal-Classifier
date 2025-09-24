from flask import Blueprint, jsonify

api_bp = Blueprint('api_bp', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for the user service."""
    return jsonify({
        "status": "healthy",
        "service": "user_service"
    }), 200
