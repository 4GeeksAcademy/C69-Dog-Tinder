from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    likes = db.relationship('Like', backref='user', lazy=True)

class Profile(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
     username = db.Column(db.String(80), unique=True, nullable=False)
     bio = db.Column(db.String(200))
     age = db.Column(db.Integer)
     breed=db.Column(db.String(200))
     city=db.Column(db.String(200))
     state=db.Column(db.String(200))
     temperment=db.Column(db.String(200))
     looking_for=db.Column(db.String(200))
     photos = db.Column(db.String(500)) #photos stored as URL potentially


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    target_user_id = db.Column(db.Integer, nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, nullable=False)
    to_user_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

class Settings(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
     age = db.Column(db.Integer)
     breed=db.Column(db.String(200))
     distance=db.Column(db.Integer)
     temperment=db.Column(db.String(200))
     looking_for=db.Column(db.String(200))