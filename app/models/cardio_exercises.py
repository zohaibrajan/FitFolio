from .db import db, environment, SCHEMA, add_prefix_for_prod


class CardioExercise(db.Model):
    __tablename__ = "cardio_exercises"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_name = db.Column(db.String(50), nullable=False)
    intensity = db.Column(db.String, nullable=False)
    calories_per_minute = db.Column(db.Float, nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True)

    cardio_logs = db.relationship("CardioLog", back_populates='exercise', cascade='all, delete-orphan')
    versions = db.relationship('UserCardioExerciseVersion', back_populates='cardio_exercise')
    created_by = db.relationship("User", back_populates="cardio_exercises")


    def to_dict(self):
        return {
            "id": self.id,
            "exerciseName": self.exercise_name,
            "caloriesPerMinute": self.calories_per_minute,
            "intensity": self.intensity,
        }
