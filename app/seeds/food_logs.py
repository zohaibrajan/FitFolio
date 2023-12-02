from app.models import db, FoodLog, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime
import csv


def seed_foods_logs():
    with open("app/seeds/food_logs.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  food_log = FoodLog(
                        food_id = int(row[0]),
                        servings = int(row[1]),
                        calories_consumed = int(row[2]),
                        protein_consumed = int(row[3]),
                        date = datetime.strptime(row[4], "%Y-%m-%d").date(),
                        user_id = int(row[5]),
                  )
                  db.session.add(food_log)
                  db.session.commit()


def undo_foods_logs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.food_logs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM food_logs"))

    db.session.commit()
