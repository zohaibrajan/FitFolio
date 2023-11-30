from .db import db, environment, SCHEMA, add_prefix_for_prod


class WeightLog(db.Model):
    __tablename__ = "weight_logs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("weight_exercises.id")), nullable=True)
    day_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("days.id")), nullable=True)

    day = db.relationship("Day", back_populates='weight_log')
    exercise = db.relationship("WeightExercise", back_populates='weight_logs')
