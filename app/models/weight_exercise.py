from .db import db, environment, SCHEMA, add_prefix_for_prod


class WeightExercise(db.Model):
    __tablename__ = "weight_exercises"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_name = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    calories_burned = db.Column(db.Integer, nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), nullable=True)


    def to_dict(self):
        return {
            "id": self.id,
            "exerciseName": self.exercise_name,
            "duration": self.duration,
            "caloriesBurned": self.calories_burned,
            "createdByUserId": self.created_by_user_id
        }
