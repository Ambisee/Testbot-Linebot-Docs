import os
from datetime import timedelta
from secrets import token_hex

class Config(object):
    FLASK_ENV = 'development'
    SECRET_KEY = os.environ.get('SECRET_KEY')
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_COOKIE_SECURE = True
    
    # The prefix postgres:// on Heroku must be changed to postgresql:// for SQLAlchemy to work
    uri = os.getenv('DATABASE_URL')
    SQLALCHEMY_DATABASE_URI = uri.replace('postgres://', 'postgresql://') if uri is not None else uri


class DevelopmentConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True
    TESTING = True
    SECRET_KEY = token_hex(20)
    SESSION_COOKIE_SECURE = False
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')