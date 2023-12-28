from app.models import db, UserCardioExerciseVersion, environment, SCHEMA
from sqlalchemy.sql import text
import csv


def seed_user_cardio_exercises():
    with open("app/seeds/user_cardio_exercises.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  exercise = UserCardioExerciseVersion(
                        created_by_user_id = int(row[0]),
                        cardio_exercise_id = int(row[1]),
                        exercise_name = row[2],
                        intensity = row[3],
                        calories_per_minute = int(row[4]),
                  )
                  db.session.add(exercise)
                  db.session.commit()


def undo_user_cardio_exercises():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_cardio_exercise_versions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_cardio_exercise_versions"))

    db.session.commit()
