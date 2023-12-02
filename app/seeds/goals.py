from app.models import db, Goal, environment, SCHEMA
from sqlalchemy.sql import text
import csv

def seed_goals():
    with open("app/seeds/goals.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  goal = Goal(
                        user_id = int(row[0]),
                        goal = row[1],
                        starting_weight = int(row[2]),
                        target_weight = int(row[3]),
                        lbs_per_week = float(row[4]),
                        calories_per_day = int(row[5])
                  )
                  db.session.add(goal)
                  db.session.commit()


def undo_goals():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.goals RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM goals"))

    db.session.commit()
