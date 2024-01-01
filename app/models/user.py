from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String, nullable=False)
    height_ft = db.Column(db.Integer, nullable=False)
    height_in = db.Column(db.Integer, nullable=True)
    current_weight_lbs = db.Column(db.Integer, nullable=False)

    goal = db.relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    foods = db.relationship("Food", back_populates="created_by", cascade="all, delete-orphan")
    cardio_exercises = db.relationship("CardioExercise", back_populates="created_by", cascade="all, delete-orphan")
    cardio_exercise_versions = db.relationship('UserCardioExerciseVersion', back_populates='user')
    food_versions = db.relationship('UserFoodVersion', back_populates='user')
    weight_exercise_versions = db.relationship('UserWeightExerciseVersion', back_populates='user')
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

    def to_dict_with_info(self):
        return {
            'id': self.id,
            'username': self.username,
            "dateOfBirth": self.dob.strftime("%Y-%m-%d"),
            "gender": self.gender,
            "heightFt": self.height_ft,
            "heightIn": self.height_in,
            "currentWeight": self.current_weight_lbs
        }
