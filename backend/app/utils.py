from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify
from app import db
from app.models import User
from app.models import Whisper, Response, Reaction

def add_models_to_dict(model):
    if not model:
        return None
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    model.to_dict = to_dict
    return model

# Apply to all models
for model in [User, Whisper, Response, Reaction]:
    add_models_to_dict(model)

# Add password hashing to User model
def set_password(self, password):
    self.password_hash = generate_password_hash(password)

def check_password(self, password):
    return check_password_hash(self.password_hash, password)

User.set_password = set_password
User.check_password = check_password