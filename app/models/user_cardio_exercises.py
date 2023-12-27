from .db import db, environment, SCHEMA, add_prefix_for_prod


user_cardio_exercises = db.Table('user_cardio_exercises',
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('cardio_exercise_id', db.Integer, db.ForeignKey(add_prefix_for_prod('cardio_exercises.id')), primary_key=True)
)


if environment == "production":
    user_cardio_exercises.schema = SCHEMA
