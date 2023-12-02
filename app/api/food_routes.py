from flask import Blueprint
from flask_login import login_required
from app.models import Food


food_routes = Blueprint("foods", __name__)


@food_routes.route("")
@login_required
def get_all_cardio_exercises():
    """Getting all Foods"""
    foods = Food.query.all()

    return {
        "foods": [food.to_dict_nutrition() for food in foods]
    }

@food_routes.route("/<int:foodId>")
@login_required
def get_cardio_food(foodId):
    """Get a single Food"""
    food = Food.query.get(foodId)

    return {
        "food": food.to_dict_nutrition()
    }
