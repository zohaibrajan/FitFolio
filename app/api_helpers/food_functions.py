from flask_login import current_user
from app.utils import get_food
from app.models import db, FoodLog, Food
from datetime import datetime


def create_food_log(data):
    food_from_form = data['name']
    servings = int(data["servings"])

    food = get_food(food_from_form)

    if not food:
        return {
                "errorMessage": "Sorry, Food Does Not Exist"
        }, 404

    calories_consumed = servings * food.calories
    protein_consumed = servings * food.protein

    new_food_log = FoodLog(
        servings = servings,
        calories_consumed = calories_consumed,
        protein_consumed = protein_consumed,
        food_id = int(food.id),
        date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
        user_id = int(current_user.id)
    )

    db.session.add(new_food_log)
    db.session.commit()

    return new_food_log.to_dict(), 201


def update_food_log(food_log, data):
    food_from_form = data['name']
    servings = int(data["servings"])

    food = get_food(food_from_form)

    if not food:
        return {
            "errorMessage": "Sorry, Food Does Not Exist"
        }, 404

    updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

    food_log.servings = servings
    food_log.calories_consumed = servings * food.calories
    food_log.protein_consumed = servings * food.protein
    food_log.food_id = int(food.id)
    food_log.date = updated_date
    food_log.user_id = int(current_user.id)

    db.session.commit()

    return food_log.to_dict(), 200
