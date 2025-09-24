from flask import Flask

def create_app():
    """Application factory for the user service."""
    app = Flask(__name__)

    with app.app_context():
        # Import and register blueprints
        from .api import routes
        app.register_blueprint(routes.api_bp, url_prefix='/api/users')

    return app
