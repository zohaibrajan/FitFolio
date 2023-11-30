from .db import db, environment, SCHEMA, add_prefix_for_prod


class WeightExercise(db.Model):
    __tablename__ = "weight_exercises"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_name = db.Column(db.String(50), nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True)

    weight_logs = db.relationship("WeightLog", back_populates="exercise", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            "id": self.id,
            "exerciseName": self.exercise_name,
            "sets": self.sets,
            "repetitions": self.repetitions,
            "weightPerRep": self.weight_per_rep,
            "createdByUserId": self.created_by_user_id
        }
