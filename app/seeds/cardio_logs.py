from app.models import db, CardioLog, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime
import csv


def seed_cardio_logs():
    with open("app/seeds/cardio_logs.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  cardio_log = CardioLog(
                        duration = int(row[0]),
                        exercise_id = int(row[1]),
                        calories_burned = int(row[2]),
                        date = datetime.strptime(row[3], "%Y-%m-%d").date(),
                        user_id = int(row[4])
                  )
                  db.session.add(cardio_log)
                  db.session.commit()


def undo_cardio_logs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cardio_logs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cardio_logs"))

    db.session.commit()
