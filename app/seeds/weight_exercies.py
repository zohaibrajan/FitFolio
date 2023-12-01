from app.models import db, WeightExercise, environment, SCHEMA
from sqlalchemy.sql import text
import csv

def seed_weight_exercises():
    with open("app/seeds/weight_exercises.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  exercise = WeightExercise(
                        exercise_name = row[0],
                        created_by_user_id = row[1],
                  )
                  db.session.add(exercise)
                  db.session.commit()


def undo_weight_exercises():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.weight_exercises RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM weight_exercises"))

    db.session.commit()
