from flask_login import current_user
from app.utils import get_food
from app.models import db, FoodLog, Food


def create_food_log(data):
    food_from_form = data['name']
    servings = int(data["servings"])

    food = Food.query.filter(Food.name.ilike(f"{food_from_form}")).first()

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
        date = data["date"],
        user_id = int(current_user.id)
    )

    db.session.add(new_food_log)
    db.session.commit()

    return new_food_log.to_dict(), 201
