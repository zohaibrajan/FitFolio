from .db import db, environment, SCHEMA, add_prefix_for_prod


class CardioExercise(db.Model):
    __tablename__ = "cardio_exercises"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_name = db.Column(db.String(50), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    repetitions = db.Column(db.Integer, nullable=False)
    weight_per_rep = db.Column(db.Integer, nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), nullable=True)
