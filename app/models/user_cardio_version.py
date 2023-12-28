from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserCardioExerciseVersion(db.Model):
    __tablename__ = 'user_cardio_exercise_versions'

    id = db.Column(db.Integer, primary_key=True)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    cardio_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('cardio_exercises.id')))
    exercise_name = db.Column(db.String(50), nullable=False)
    intensity = db.Column(db.String, nullable=False)
    calories_per_minute = db.Column(db.Float, nullable=False)

    user = db.relationship('User', back_populates='cardio_exercise_versions')
    cardio_exercise = db.relationship('CardioExercise', back_populates='versions')

    def to_dict(self):
        return {
            "id": self.id,
            "exerciseName": self.exercise_name,
            "caloriesPerMinute": self.calories_per_minute,
            "intensity": self.intensity,
        }
