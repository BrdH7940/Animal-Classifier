import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import DevelopmentConfig
from models.model_loader import load_classification_model

def create_app(config_object=DevelopmentConfig):
    # Configure Flask to use the 'frontend' directory for static files,
    # and serve them from the root URL.
    app = Flask(__name__, static_folder='../../frontend', static_url_path='/') # Create process, socket and every essential things for the app to run locally

    app.config.from_object(config_object) # Load the configuration object
    CORS(app) # Allow cross-origin requests

    @app.route('/') # Serve the main page
    def index():
        # The main page is now served as a static file.
        return app.send_static_file('index.html') # Load front-end page for the web

    with app.app_context():
        app.model = load_classification_model()

        from .api.classification import classification_bp, health_bp
        app.register_blueprint(classification_bp)
        app.register_blueprint(health_bp)

    return app