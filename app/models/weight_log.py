from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class WeightLog(db.Model):
    __tablename__ = "weight_logs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    sets = db.Column(db.Integer, nullable=False)
    repetitions = db.Column(db.Integer, nullable=False)
    weight_per_rep = db.Column(db.Integer, nullable=False)
    user_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user_weight_exercise_versions.id")), nullable=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("weight_exercises.id")), nullable=True)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)


    user = db.relationship("User", back_populates="weight_logs")
    user_exercise = db.relationship("UserWeightExerciseVersion", back_populates='weight_logs')
    exercise = db.relationship("WeightExercise", back_populates='weight_logs')


    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.strftime("%Y-%m-%d"),
            "weightExercise": self.exercise.to_dict() if self.exercise else self.user_exercise.to_dict(),
            "sets": self.sets,
            "repetitions": self.repetitions,
            "weightPerRep": self.weight_per_rep
        }
