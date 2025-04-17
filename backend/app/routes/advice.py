from flask import Blueprint, request, jsonify
from ..models import db, AdvicePost
from flask_jwt_extended import jwt_required, get_jwt_identity
import openai
import os

advice_bp = Blueprint("advice", __name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@advice_bp.route("/", methods=["GET"])
def get_all_posts():
    posts = AdvicePost.query.order_by(AdvicePost.created_at.desc()).all()
    return jsonify([{
        "id": p.id,
        "message": p.message,
        "tag": p.tag,
        "created_at": p.created_at.isoformat()
    } for p in posts]), 200

@advice_bp.route("/", methods=["POST"])
@jwt_required()
def post_advice():
    data = request.get_json()
    message = data.get("message")
    tag = data.get("tag")

    if not message or len(message) > 500:
        return jsonify({"error": "Message required (max 500 chars)"}), 400

    post = AdvicePost(message=message, tag=tag)
    db.session.add(post)
    db.session.commit()
    return jsonify({"message": "Posted!"}), 201

@advice_bp.route("/hug", methods=["POST"])
def hug_mode():
    data = request.get_json()
    prompt = data.get("message", "")

    if not prompt:
        return jsonify({"error": "Message required"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a soft, affirming, queer-friendly advice whisperer."},
                {"role": "user", "content": prompt}
            ]
        )
        reply = response['choices'][0]['message']['content']
        return jsonify({"hug": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
