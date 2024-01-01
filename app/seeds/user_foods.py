from app.models import db, UserFoodVersion, environment, SCHEMA
from sqlalchemy.sql import text
import csv


def seed_user_food_versions():
    with open("app/seeds/user_food_versions.csv", "r") as file:
            csvreader = csv.reader(file)

            for row in csvreader:
                  food = UserFoodVersion(
                        created_by_user_id = int(row[0]),
                        food_name = row[1],
                        restaurant = row[2],
                        calories = int(row[3]),
                        protein = int(row[4]),
                        is_deleted = False
                  )
                  db.session.add(food)
                  db.session.commit()


def undo_user_food_versions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_food_versions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_food_versions"))

    db.session.commit()
