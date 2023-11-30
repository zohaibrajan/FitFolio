from .db import db, environment, SCHEMA, add_prefix_for_prod


class DailySummary(db.Model):
    __tablename__ = "daily_summary"


    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    user_id =  db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), nullable=False)
    cardio_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cardio_exercises.id")), nullable=False)
    weight_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("weight_exercises.id")), nullable=False)
    cardio_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("cardio_exercises.id")), nullable=False)

