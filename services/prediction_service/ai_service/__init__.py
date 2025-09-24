import os
from flask import Flask
from flask_cors import CORS
from config import DevelopmentConfig
from models.model_loader import load_classification_model

def create_app(config_object=DevelopmentConfig):
    app = Flask(__name__) # Create process, socket and every essential things for the app to run locally
    
    # Allow cross-origin requests, which is essential for a microservices architecture.
    CORS(app) 
    
    app.config.from_object(config_object) # Load the configuration object

    with app.app_context():
        app.model = load_classification_model()

        from .api.classification import classification_bp, health_bp
        app.register_blueprint(classification_bp)
        app.register_blueprint(health_bp)

    return app