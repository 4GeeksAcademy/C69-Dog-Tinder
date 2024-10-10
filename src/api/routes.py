"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from .models import db, User, Profile, Like, Message, Settings
import requests
import math
import os
from app import app

api = Blueprint('routes', __name__)
jwt = JWTManager(app)

@api.before_app_request
def create_tables():
    db.create_all()

# User registration
@api.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    
    # Create a new profile for the user
    new_profile = Profile(user_id=new_user.id)
    db.session.add(new_profile)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@api.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "userId": user.id}), 200
    return jsonify({"message": "Bad credentials"}), 401


@api.route('/users/<int:user_id>/profile', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    profile = Profile.query.filter_by(user_id=user.id).first()
    return jsonify({
        "userId": user.id,
        "username": user.username,
        "bio": profile.bio,
        "age": profile.age,
        "breed": profile.breed,
        "city": profile.city,
        "state": profile.state,
        "temperment": profile.temperment,
        "looking_for": profile.looking_for,
        "photos": profile.photos.split(',') if profile.photos else []
    }), 200

@api.route('/users/<int:user_id>/settings', methods=['GET'])
@jwt_required()
def get_user_settings(user_id):
    user = User.query.get_or_404(user_id)
    settings = Settings.query.filter_by(user_id=user.id).first()
    return jsonify({
        "userId": user.id,
        "age": settings.age,
        "breed": settings.breed,
        "distance": settings.distance,
        "temperment": settings.temperment,
        "looking_for": settings.looking_for,
    }), 200


@api.route('/users/<int:user_id>/profile', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    data = request.get_json()
    profile = Profile.query.filter_by(user_id=user_id).first()
    profile.bio = data.get('bio', profile.bio)
    profile.age = data.get('age', profile.age)
    profile.breed=data.get('breed', profile.breed)
    profile.city=data.get('city', profile.city)
    profile.state=data.get('state', profile.state)
    profile.temperment=data.get('temperment', profile.temperment)
    profile.looking_for=data.get('looking_for', profile.looking_for)
    profile.photos = ','.join(data.get('photos', []))  # This assumes URLS might need change later
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

@api.route('/users/<int:user_id>/settings', methods=['PUT'])
@jwt_required()
def update_user_settings(user_id):
    data = request.get_json()
    settings = Settings.query.filter_by(user_id=user_id).first()
    settings.age = data.get('age', settings.age)
    settings.breed=data.get('breed', settings.breed)
    settings.distance=data.get('distance', settings.distance)
    settings.temperment=data.get('temperment', settings.temperment)
    settings.looking_for=data.get('looking_for', settings.looking_for)

    db.session.commit()
    return jsonify({"message": "Settings updated successfully"}), 200


@api.route('/swipe/right', methods=['POST'])
@jwt_required()
def swipe_right():
    data = request.get_json()
    new_like = Like(user_id=data['userId'], target_user_id=data['targetUserId'])
    db.session.add(new_like)
    db.session.commit()
    return jsonify({"message": "You liked the user"}), 200


@api.route('/users/<int:user_id>/matched', methods=['GET'])
@jwt_required()
def get_matches(user_id):
    likes = Like.query.filter_by(user_id=user_id).all()
    matches = [like.target_user_id for like in likes]
    return jsonify({"matches": matches}), 200


@api.route('/users/<int:user_id>/unmatch/<int:dog_id>', methods=['DELETE'])
@jwt_required()
def unmatch(user_id, dog_id):
    like = Like.query.filter_by(user_id=user_id, target_user_id=dog_id).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return jsonify({"message": "Unmatched successfully"}), 200
    return jsonify({"message": "Match not found"}), 404


@api.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()
    new_message = Message(from_user_id=data['fromUserId'], to_user_id=data['toUserId'], content=data['content'])
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"}), 200


@api.route('/messages/<int:user_id>/<int:partner_user_id>', methods=['GET'])
@jwt_required()
def get_messages(user_id, partner_user_id):
    messages = Message.query.filter(
        (Message.from_user_id == user_id) & (Message.to_user_id == partner_user_id) |
        (Message.from_user_id == partner_user_id) & (Message.to_user_id == user_id)
    ).all()
    return jsonify([{"from": msg.from_user_id, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]), 200

def get_geo_location(city, state):
    api_key = os.environ.get('Geolocation_api_key')
    query = f"{city}, {state}"
    url = f"https://api.opencagedata.com/geocode/v1/json?q={query}&key={api_key}"

    response = requests.get(url)
    data = response.json()

    if data['results']:
        location = data['results'][0]['geometry']
        return location['lat'], location['lng']
    else:
        return None
    
def haversine(lat1, lon1, lat2, lon2):
    # copied the haversine formula off the internet... should put lat long to miles
    R = 3956

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))

    distance = R * c
    return distance

