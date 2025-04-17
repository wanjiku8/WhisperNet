from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from .routes.advice import advice_bp
from .routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    Migrate(app, db)
    CORS(app)
    JWTManager(app)

    app.register_blueprint(advice_bp, url_prefix="/api/advice")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app
