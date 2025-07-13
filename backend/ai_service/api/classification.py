from flask import Blueprint, request, jsonify, current_app
from ..services.classification_service import get_prediction
from ..utils.image_processor import allowed_file

# Create a Blueprint for the classification API
classification_bp = Blueprint('classification', __name__)
health_bp = Blueprint('health', __name__)

@classification_bp.route('/api/classify', methods = ['POST'])
def classify_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        image_bytes = file.read()
        model = current_app.model
        result = get_prediction(model, image_bytes)
        return jsonify(result)
    except Exception as e:
        current_app.logger.error(f"Classification error: {str(e)}")
        return jsonify({'error': 'Failed to classify image'}), 500
    
@health_bp.route('/api/health', methods = ['GET'])
def health_check():
    model_is_loaded = current_app.model is not None
    return jsonify({'status': 'healthy', 'model_loaded': model_is_loaded})