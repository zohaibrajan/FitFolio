from app.models import db, WeightLog, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime
import csv


def seed_weight_logs():
    with open("app/seeds/weight_logs.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  weight_log = WeightLog(
                        sets = int(row[0]),
                        repetitions = int(row[1]),
                        weight_per_rep = int(row[2]),
                        exercise_id = int(row[3]),
                        date = datetime.strptime(row[4], "%Y-%m-%d").date(),
                        user_id = int(row[5])
                  )
                  db.session.add(weight_log)
                  db.session.commit()


def undo_weight_logs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.weight_logs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM weight_logs"))

    db.session.commit()
