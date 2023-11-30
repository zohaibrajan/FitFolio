from .db import db, environment, SCHEMA, add_prefix_for_prod


class CardioLog(db.Model):
    __tablename__ = "cardio_logs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cardio_exercises.id")), nullable=True)
    day_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("days.id")), nullable=True)


    day = db.relationship("Day", back_populates='cardio_log')
    exercise = db.relationship("CardioExercise", back_populates='cardio_logs')
