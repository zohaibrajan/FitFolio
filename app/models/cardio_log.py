from .db import db, environment, SCHEMA, add_prefix_for_prod


class CardioLog(db.Model):
    __tablename__ = "cardio_logs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    duration = db.Column(db.Integer, nullable=False)
    calories_burned = db.Column(db.Integer, nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cardio_exercises.id")), nullable=True)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    exercise = db.relationship("CardioExercise", back_populates='cardio_logs')
    user = db.relationship("User", back_populates="cardio_logs")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "cardioExercise": self.exercise.to_dict(),
            "duration": self.duration,
            "caloriesBurned": self.calories_burned
        }
