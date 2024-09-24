"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Profile, Like, Message

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tinder_app.db'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

# User registration
@app.route('/api/users/register', methods=['POST'])
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


@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "userId": user.id}), 200
    return jsonify({"message": "Bad credentials"}), 401


@app.route('/api/users/<int:user_id>/profile', methods=['GET'])
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
        "location": profile.location,
        "temperment": profile.temperment,
        "looking_for": profile.looking_for,
        "photos": profile.photos.split(',') if profile.photos else []
    }), 200


@app.route('/api/users/<int:user_id>/profile', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    data = request.get_json()
    profile = Profile.query.filter_by(user_id=user_id).first()
    profile.bio = data.get('bio', profile.bio)
    profile.age = data.get('age', profile.age)
    profile.breed=data.get('breed', profile.breed)
    profile.location=data.get('location', profile.location)
    profile.temperment=data.get('temperment', profile.temperment)
    profile.looking_for=data.get('looking_for', profile.looking_for)
    profile.photos = ','.join(data.get('photos', []))  # This assumes URLS might need change later
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

# Swipe Right (Like)
@app.route('/api/swipe/right', methods=['POST'])
@jwt_required()
def swipe_right():
    data = request.get_json()
    new_like = Like(user_id=data['userId'], target_user_id=data['targetUserId'])
    db.session.add(new_like)
    db.session.commit()
    return jsonify({"message": "You liked the user"}), 200

# Get Matches
@app.route('/api/users/<int:user_id>/matched', methods=['GET'])
@jwt_required()
def get_matches(user_id):
    likes = Like.query.filter_by(user_id=user_id).all()
    matches = [like.target_user_id for like in likes]
    return jsonify({"matches": matches}), 200

# Send a Message
@app.route('/api/messages', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()
    new_message = Message(from_user_id=data['fromUserId'], to_user_id=data['toUserId'], content=data['content'])
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"}), 200

# Get Messages
@app.route('/api/messages/<int:user_id>/<int:partner_user_id>', methods=['GET'])
@jwt_required()
def get_messages(user_id, partner_user_id):
    messages = Message.query.filter(
        (Message.from_user_id == user_id) & (Message.to_user_id == partner_user_id) |
        (Message.from_user_id == partner_user_id) & (Message.to_user_id == user_id)
    ).all()
    return jsonify([{"from": msg.from_user_id, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]), 200

if __name__ == '__main__':
    app.run(debug=True)
