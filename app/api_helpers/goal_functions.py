from flask_login import current_user
from app.utils import *
from app.models import db, Goal


def create_goal(data, user, user_info):
    goal = data["goal"]
    lbs_per_week = data["lbs_per_week"]
    starting_weight_kg = data["starting_weight"] * 0.453592
    age = calculate_age(user_info["dateOfBirth"])
    height = convert_height_to_cm(user_info["heightFt"], user_info["heightIn"])
    gender = user_info["gender"]
    calories_per_day = calculate_calories_per_day(gender, starting_weight_kg, height, age, goal, lbs_per_week)

    starting_weight = data["starting_weight"] if data["starting_weight"] != user_info["currentWeight"] else user_info["currentWeight"]
    user.current_weight_lbs = starting_weight

    new_goal = Goal(
        user_id = current_user.id,
        goal = goal,
        starting_weight = starting_weight,
        target_weight = data["target_weight"],
        lbs_per_week = lbs_per_week,
        calories_per_day = calories_per_day
    )

    db.session.add(new_goal)
    db.session.flush()
    db.session.commit()

    return new_goal.to_dict()
