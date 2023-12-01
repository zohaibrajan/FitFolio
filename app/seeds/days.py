from app.models import db, Day, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text
import csv

def seed_days():
    with open("app/seeds/days.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  exercise = Day(
                        user_id = row[0],
                        date = datetime.strptime(row[1], "%Y-%m-%d").date()
                  )
                  db.session.add(exercise)
                  db.session.commit()


def undo_days():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.days RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM weight_exercises"))

    db.session.commit()
