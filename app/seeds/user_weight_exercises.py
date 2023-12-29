from app.models import db, UserWeightExerciseVersion, environment, SCHEMA
from sqlalchemy.sql import text
import csv


def seed_user_weight_exercises():
    with open("app/seeds/user_weight_exercises.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  exercise = UserWeightExerciseVersion(
                        created_by_user_id = int(row[0]),
                        exercise_name = row[1],
                        weight_exercise_id = int(row[2]),
                        is_deleted = False
                  )
                  db.session.add(exercise)
                  db.session.commit()


def undo_user_weight_exercises():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_weight_exercise_versions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_weight_exercise_versions"))

    db.session.commit()
