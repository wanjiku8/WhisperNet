from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from app import db
from app.models import User, Whisper, Response, Reaction
import openai
import os

bp = Blueprint('advice', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

@bp.route('/whispers', methods=['GET'])
def get_whispers():
    tag_filter = request.args.get('tag')
    query = Whisper.query.order_by(Whisper.created_at.desc())
    
    if tag_filter:
        query = query.filter(Whisper.tags.contains(tag_filter))
    
    whispers = query.all()
    return jsonify([whisper.to_dict() for whisper in whispers]), 200

@bp.route('/whispers', methods=['POST'])
@jwt_required(optional=True)
def create_whisper():
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    whisper = Whisper(
        content=data['content'],
        tags=data.get('tags', ''),
        is_anonymous=data.get('is_anonymous', True),
        user_id=get_jwt_identity() if not data.get('is_anonymous', True) else None
    )
    
    db.session.add(whisper)
    db.session.commit()
    return jsonify(whisper.to_dict()), 201

@bp.route('/whispers/<int:whisper_id>/responses', methods=['POST'])
@jwt_required(optional=True)
def create_response(whisper_id):
    whisper = Whisper.query.get_or_404(whisper_id)
    data = request.get_json()
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    response = Response(
        content=data['content'],
        is_hug=data.get('is_hug', False),
        whisper_id=whisper.id,
        user_id=get_jwt_identity() if not data.get('is_anonymous', True) else None
    )
    
    db.session.add(response)
    db.session.commit()
    return jsonify(response.to_dict()), 201

@bp.route('/whispers/<int:whisper_id>/hug', methods=['POST'])
def send_hug(whisper_id):
    whisper = Whisper.query.get_or_404(whisper_id)
    
    try:
        # Generate a kind response using GPT
        openai.api_key = os.getenv('OPENAI_API_KEY')
        prompt = f"Generate a kind, supportive response to this anonymous message: {whisper.content}"
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": "You are a kind, supportive assistant. Provide a short, comforting response."},
                     {"role": "user", "content": prompt}]
        )
        
        response_content = completion.choices[0].message.content
        
        response = Response(
            content=response_content,
            is_hug=True,
            is_gpt=True,
            whisper_id=whisper.id
        )
        
        db.session.add(response)
        db.session.commit()
        return jsonify(response.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/whispers/<int:whisper_id>/react', methods=['POST'])
@jwt_required()
def react_to_whisper(whisper_id):
    whisper = Whisper.query.get_or_404(whisper_id)
    user_id = get_jwt_identity()
    
    # Check if user already reacted
    existing_reaction = Reaction.query.filter_by(
        user_id=user_id,
        whisper_id=whisper.id
    ).first()
    
    if existing_reaction:
        db.session.delete(existing_reaction)
        db.session.commit()
        return jsonify({'message': 'Reaction removed'}), 200
    
    reaction = Reaction(
        user_id=user_id,
        whisper_id=whisper.id
    )
    
    db.session.add(reaction)
    db.session.commit()
    return jsonify(reaction.to_dict()), 201