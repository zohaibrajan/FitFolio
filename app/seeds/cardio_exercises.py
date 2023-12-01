from app.models import db, CardioExercise, environment, SCHEMA
from sqlalchemy.sql import text
import csv


def seed_cardio_exercises():
    with open("app/seeds/cardio_exercises.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  exercise = CardioExercise(
                        exercise_name = row[0],
                        intensity = row[1],
                        calories_per_minute = int(row[2]),
                        created_by_user_id = int(row[3]),
                  )
                  db.session.add(exercise)
                  db.session.commit()


def undo_cardio_exercises():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cardio_exercises RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cardio_exercises"))

    db.session.commit()
