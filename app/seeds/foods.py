from app.models import db, Food, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime
import csv


def seed_foods():
    with open("app/seeds/foods.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  food = Food(
                        name = row[0],
                        restaurant = row[1],
                        calories = int(row[2]),
                        protein = int(row[3]),
                        created_by_user_id = int(row[4]),
                        can_others_use = True,
                        is_deleted = False,
                        unit_of_serving = row[5]
                  )
                  db.session.add(food)
                  db.session.commit()


def undo_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.foods RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM foods"))

    db.session.commit()
