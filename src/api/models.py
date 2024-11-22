from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    dogs = db.relationship('DogProfile', backref='owner', lazy=True)
    likes = db.relationship('Like', backref='user', lazy=True)
    settings = db.relationship("Settings", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User: {self.username}>"


class DogProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Dog belongs to a user
    # user = db.relationship("User")

    dog_name = db.Column(db.String(80), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    bio = db.Column(db.String(200))
    photos = db.Column(db.String(500))  # Store URLs as comma-separated string (you can later split them)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))

    # Relationship for likes (dogs that have been liked)
    likes_received = db.relationship('Like', backref='dog', lazy=True)



class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # User who liked the dog
    target_dog_id = db.Column(db.Integer, db.ForeignKey('dog_profile.id'), nullable=False)  # The dog that was liked

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, nullable=False)
    to_user_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    min_age = db.Column(db.Integer, nullable=False, default=0)  
    max_age = db.Column(db.Integer, nullable=False, default=20)  
    max_distance = db.Column(db.Integer, nullable=False, default=100)

    user = db.relationship("User", back_populates="settings")   

    def __repr__(self):
        return f"<Settings(user_id={self.user_id}, min_age={self.min_age}, max_age={self.max_age}, max_distance={self.max_distance})>"