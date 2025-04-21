from datetime import datetime
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    responses = db.relationship('Response', backref='author', lazy='dynamic')
    reactions = db.relationship('Reaction', backref='user', lazy='dynamic')

class Whisper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    tags = db.Column(db.String(255))
    is_anonymous = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    responses = db.relationship('Response', backref='whisper', lazy='dynamic')
    reactions = db.relationship('Reaction', backref='whisper', lazy='dynamic')

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    is_hug = db.Column(db.Boolean, default=False)
    is_gpt = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    whisper_id = db.Column(db.Integer, db.ForeignKey('whisper.id'), nullable=False)

class Reaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emoji = db.Column(db.String(10), default='❤️')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    whisper_id = db.Column(db.Integer, db.ForeignKey('whisper.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)