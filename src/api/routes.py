from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS  # Importing CORS
from .models import db, User, Profile, DogProfile, Like, Message, Settings
import requests
import math
import os
from app import app

# Enable CORS for the entire app
CORS(app, resources={r"/*": {"origins": "https://effective-tribble-r4rgj66qpgvv2p5x4-3000.app.github.dev"}})

# Initialize Blueprint and JWTManager
api = Blueprint('routes', __name__)
jwt = JWTManager(app)

@api.before_app_request
def create_tables():
    db.create_all()

# User registration
@api.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if the user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists"}), 400
    
    # Ensure password confirmation matches
    if data['password'] != data['confirm_password']:
        return jsonify({"message": "Passwords do not match"}), 400
    
    # Create new user
    new_user = User(username=data['email'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
        
    # Return JWT Token for authentication
    access_token = create_access_token(identity=new_user.id)
    return jsonify({"message": "User registered successfully", "token": access_token}), 201


# Dog profile creation (for logged-in users)
@api.route('/users/dog-profile', methods=['POST'])
@jwt_required()
def add_dog_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Create a new dog profile
    new_dog = DogProfile(
        user_id=user_id,
        dog_name=data['dog_name'],
        age=data['age'],
        breed=data['breed'],
        bio=data.get('bio', ''),
        photos=','.join(data['photos']) if 'photos' in data else None  # Store photos as comma-separated string
    )
    db.session.add(new_dog)
    db.session.commit()

    return jsonify({"message": "Dog profile created successfully", "dog_id": new_dog.id}), 201


@api.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Received login data:", data)  # Para verificar los datos
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "userId": user.id}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@api.route('/dogs/available', methods=['GET'])
@jwt_required()
def get_available_dogs():
    current_user_id = get_jwt_identity()

    # Fetch all dogs excluding the ones owned by the current user
    available_dogs = DogProfile.query.filter(DogProfile.user_id != current_user_id).all()

    dog_list = []
    for dog in available_dogs:
        dog_data = {
            'id': dog.id,
            'dog_name': dog.dog_name,
            'age': dog.age,
            'breed': dog.breed,
            'bio': dog.bio,
            'city': dog.city,
            'state': dog.state,
            'photos': dog.photos.split(',')  # Convert photo URLs back into a list
        }
        dog_list.append(dog_data)

    return jsonify(dog_list), 200


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
    
    # Get the authenticated user ID from the JWT token
    current_user_id = get_jwt_identity()
    
    # Ensure the target dog exists (DogProfile)
    target_dog = DogProfile.query.get(data['targetDogId'])
    if not target_dog:
        return jsonify({"message": "Dog not found"}), 404
    
    # Create a new "like" entry where the user likes the target dog
    new_like = Like(user_id=current_user_id, target_user_id=target_dog.id)
    db.session.add(new_like)
    db.session.commit()

    return jsonify({"message": f"You liked {target_dog.dog_name}'s profile!"}), 200


@api.route('/users/<int:user_id>/matches', methods=['GET'])
@jwt_required()
def get_matches(user_id):
    # Find all dogs the user has liked
    likes_given = Like.query.filter_by(user_id=user_id).all()

    matches = []
    for like in likes_given:
        # Check if the target dog (liked dog) has liked back the user's dog
        reciprocal_like = Like.query.filter_by(user_id=like.target_dog.user_id, target_dog_id=like.user.dogs[0].id).first()
        
        if reciprocal_like:
            # Fetch details of the matched dog
            matched_dog = DogProfile.query.get(like.target_dog_id)
            matches.append({
                'dog_id': matched_dog.id,
                'dog_name': matched_dog.dog_name,
                'photos': matched_dog.photos.split(','),
                'bio': matched_dog.bio,
                'breed': matched_dog.breed
            })

    return jsonify(matches), 200


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
    R = 3956  # Earth radius in miles

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
