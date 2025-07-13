import tensorflow as tf

_model = None

def load_classification_model():
    """
    Download MobileNetV2 model from TensorFlow Hub
    """
    global _model
    if _model is None:
        try:
            print("Loading model for the first time...")
            # Use original model from ImageNet
            _model = tf.keras.applications.MobileNetV2(weights = 'imagenet')
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            _model = None
    return _model