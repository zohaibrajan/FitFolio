from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserWeightExerciseVersion(db.Model):
    __tablename__ = 'user_weight_exercise_versions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    weight_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('weight_exercises.id')))
    exercise_name = db.Column(db.String(50), nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)

    user = db.relationship('User', back_populates='weight_exercise_versions')
    weight_logs = db.relationship("WeightLog", back_populates='user_exercise')
    weight_exercise = db.relationship('WeightExercise', back_populates='versions')

    def to_dict(self):
        return {
            "id": self.id,
            "exerciseName": self.exercise_name,
            "isDeleted": self.is_deleted,
        }
