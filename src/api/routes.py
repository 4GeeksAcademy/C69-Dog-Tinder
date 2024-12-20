from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS  # Importing CORS
from .models import db, User,  DogProfile, Like, Message, Settings
import requests
import math
import os
# from app import app

# Enable CORS for the entire app

# Initialize Blueprint and JWTManager
api = Blueprint('routes', __name__)
CORS(api)

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
    db.session.refresh(new_user)
        
    # Return JWT Token for authentication
    access_token = create_access_token(identity=new_user.id)
    return jsonify({"message": "User registered successfully", "token": access_token}), 201


# Dog profile creation (for logged-in users)
@api.route('/users/dog-profile', methods=['POST'])
@jwt_required()
def add_dog_profile():
    user_id = get_jwt_identity()
    print(user_id)
    data = request.get_json()

    # Create a new dog profile
    new_dog = DogProfile(
        user_id=user_id,
        dog_name=data['dog_name'],
        age=data['age'],
        breed=data['breed'],
        bio=data.get('bio', ''),
        photos=','.join(data['photos']) if 'photos' in data else None,  
        city=data.get('city', ''),  
        state=data.get('state', '')
    )
    db.session.add(new_dog)
    db.session.commit()
    db.session.refresh(new_dog)

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

@api.route('/dogs/<int:dog_id>', methods=['GET'])
def get_dog_profile(dog_id):
    dog = DogProfile.query.get(dog_id)
    if dog:
        return jsonify({
            'id': dog.id,
            'dog_name': dog.dog_name,
            'breed': dog.breed,
            'age': dog.age,
            'bio': dog.bio,
            'photos': dog.photos.split(','),  # Convert comma-separated string to a list
            'city': dog.city,
            'state': dog.state,
        })
    return jsonify({'error': 'Dog not found'}), 404

@api.route('/users/dog-profile', methods=['GET'])
@jwt_required()
def get_user_dog_profile():
    user_id = get_jwt_identity()
    print(user_id,"user_id!!!!!!")
    # Find the dog profile associated with the authenticated user
    dog_profile = DogProfile.query.filter_by(user_id=user_id).first()

    if not dog_profile:
        return jsonify({"message": "No dog profile found"}), 404

    # Returns the dog's profile in JSON format
    return jsonify({
        "dog_name": dog_profile.dog_name,
        "age": dog_profile.age,
        "breed": dog_profile.breed,
        "bio": dog_profile.bio,
        "photos": dog_profile.photos.split(',') if dog_profile.photos else [],
        "city": dog_profile.city,
        "state": dog_profile.state,
    }), 200


@api.route('/users/dog-profile', methods=['PUT'])
@jwt_required()
def update_dog_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    dog_profile = DogProfile.query.filter_by(user_id=user_id).first()
    if not dog_profile:
        return jsonify({"message": "No dog profile found"}), 404

    # Actualiza los datos del perfil
    dog_profile.dog_name = data.get('dog_name', dog_profile.dog_name)
    dog_profile.age = data.get('age', dog_profile.age)
    dog_profile.breed = data.get('breed', dog_profile.breed)
    dog_profile.bio = data.get('bio', dog_profile.bio)
    dog_profile.photos = ','.join(data['photos']) if 'photos' in data else dog_profile.photos

    db.session.commit()
    return jsonify({
        "dog_name": dog_profile.dog_name,
        "age": dog_profile.age,
        "breed": dog_profile.breed,
        "bio": dog_profile.bio,
        "photos": dog_profile.photos.split(',') if dog_profile.photos else [],
    }), 200



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


@api.route('/users/settings', methods=['GET'])
@jwt_required()
def get_user_settings():
    current_user_id = get_jwt_identity()  # Get the current user from JWT
    settings = Settings.query.filter_by(user_id=current_user_id).first()

    # Handle case where settings might not be found for the user
    if not settings:
        return jsonify({"message": "Settings not found for the user"}), 404

    return jsonify({
        "user_id": current_user_id,
        "min_age": settings.min_age,
        "max_age": settings.max_age,
        "max_distance": settings.max_distance
    }), 200


@api.route('/users/settings', methods=['PUT'])
@jwt_required()
def update_user_settings():
    current_user_id = get_jwt_identity()  
    
    settings = Settings.query.filter_by(user_id=current_user_id).first()
    
    # If the user doesn't have existing settings, create a new one
    if not settings:
        settings = Settings(user_id=current_user_id)
        db.session.add(settings)

    data = request.get_json()
    
    settings.min_age = data.get('min_age', settings.min_age)
    settings.max_age = data.get('max_age', settings.max_age)
    settings.max_distance = data.get('max_distance', settings.max_distance)
    
    db.session.commit()

    return jsonify({
        "message": "User settings updated successfully",
        "userId": current_user_id,
        "min_age": settings.min_age,
        "max_age": settings.max_age,
        "max_distance": settings.max_distance
    }), 200



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
    new_like = Like(user_id=current_user_id, target_dog_id=target_dog.id)
    db.session.add(new_like)
    db.session.commit()

    return jsonify({"message": f"You liked {target_dog.dog_name}'s profile!"}), 200


@api.route('/users/current_user/matches', methods=['GET'])
@jwt_required()
def get_matches():
    # Find all dogs the user has liked
    user_id=get_jwt_identity()
    likes_given = Like.query.filter_by(user_id=user_id).all()
    current_user=User.query.filter_by(id=user_id).first()

    matches = []
    for like in likes_given:
        # Check if the target dog (liked dog) has liked back the user's dog
        target_dog=DogProfile.query.filter_by(id=like.target_dog_id).first()
        reciprocal_like = Like.query.filter_by(user_id=target_dog.owner.id, target_dog_id=current_user.dogs[0].id).first()
        
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


@api.route('/users/currentUser/unmatch/<int:dog_id>', methods=['DELETE'])
@jwt_required()
def unmatch(dog_id):
    user_id=get_jwt_identity()
    
    like = Like.query.filter_by(user_id=user_id, target_dog_id=dog_id).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return jsonify({"message": "Unmatched successfully"}), 200
    return jsonify({"message": "Match not found"}), 404


@api.route('/messages/send', methods=['POST'])
@jwt_required()
def send_message():
    # Get the current user's ID from the JWT token
    from_user_id = get_jwt_identity()
    
    # Get the data from the request
    data = request.get_json()
    
    to_user_id = data.get('to_user_id')
    content = data.get('content')

    if not to_user_id or not content:
        return jsonify({"msg": "Missing required fields: to_user_id and content"}), 400
    
    # Create a new message
    message = Message(
        from_user_id=from_user_id,
        to_user_id=to_user_id,
        content=content
    )

    try:
        # Save the message to the database
        db.session.add(message)
        db.session.commit()
        return jsonify({
            "from_user_id": message.from_user_id,
            "to_user_id": message.to_user_id,
            "content": message.content,
            "timestamp": message.timestamp.isoformat()  # Return timestamp in ISO format
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error sending message", "error": str(e)}), 500


@api.route('/messages/<int:partner_user_id>', methods=['GET'])
@jwt_required()
def get_messages(partner_user_id):
    # Get the current user's ID from the JWT token
    user_id = get_jwt_identity()

    # Fetch all messages where the current user is involved with the given partner_user_id
    messages = Message.query.filter(
        ((Message.from_user_id == user_id) & (Message.to_user_id == partner_user_id)) |
        ((Message.to_user_id == user_id) & (Message.from_user_id == partner_user_id))
    ).order_by(Message.timestamp.desc()).all()

    # Prepare the response data
    messages_data = [
        {
            "id": msg.id,
            "from_user_id": msg.from_user_id,
            "to_user_id": msg.to_user_id,
            "content": msg.content,
            "timestamp": msg.timestamp.isoformat()
        }
        for msg in messages
    ]

    if not messages_data:
        return jsonify({"messages": []}), 200  

    return jsonify({"messages": messages_data}), 200

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
