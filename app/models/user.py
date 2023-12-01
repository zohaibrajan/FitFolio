from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    goal = db.relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    foods = db.relationship("Food", back_populates="created_by", cascade="all, delete-orphan")
    cardio_exercises = db.relationship("CardioExercise", back_populates="created_by", cascade="all, delete-orphan")
    weight_exercises = db.relationship("WeightExercise", back_populates="created_by", cascade="all, delete-orphan")
    weight_logs = db.relationship("WeightLog", back_populates="user", cascade="all, delete-orphan")
    cardio_logs = db.relationship("CardioLog", back_populates="user", cascade="all, delete-orphan")
    food_logs = db.relationship("FoodLog", back_populates="user", cascade="all, delete-orphan")


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
