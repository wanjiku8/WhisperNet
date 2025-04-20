from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .routes.advice import advice_bp
from .routes.auth import auth_bp
import os
from dotenv import load_dotenv

load_dotenv()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object("config.Config")

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(advice_bp, url_prefix="/api/advice")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app
