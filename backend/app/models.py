from datetime import datetime
from . import db

whisper_tags = db.Table('whisper_tags',
    db.Column('whisper_id', db.Integer, db.ForeignKey('whisper.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password_hash = db.Column(db.String(128))
    hugs = db.relationship('Hug', backref='author', lazy=True)

class Whisper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    hugs = db.relationship('Hug', backref='whisper', lazy=True, cascade='all, delete-orphan')
    reactions = db.relationship('Reaction', backref='whisper', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary=whisper_tags, backref=db.backref('whispers', lazy='dynamic'))

class Hug(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    whisper_id = db.Column(db.Integer, db.ForeignKey('whisper.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class Reaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emoji = db.Column(db.String(10), nullable=False)  # e.g., ❤️
    whisper_id = db.Column(db.Integer, db.ForeignKey('whisper.id'), nullable=False)
