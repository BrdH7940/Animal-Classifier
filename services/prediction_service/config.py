import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "a_super_secret_key")
    DEBUG = False
    TESTING = False
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    UPLOAD_FOLDER = "uploads"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp"}

class DevelopmentConfig(Config):
    DEBUG = True