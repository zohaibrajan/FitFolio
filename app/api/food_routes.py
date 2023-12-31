from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Food, db
from app.forms import FoodForm
from app.utils import verify_food


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


@food_routes.route("/new", methods=["POST"])
@login_required
def create_food():
    """Create a Food"""
    form = FoodForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data

        food = Food(
            name=data["name"],
            restaurant=data["restaurant"],
            calories=data["calories"],
            protein=data["protein"],
            created_by_user_id=current_user.id,
            is_deleted=False
        )

        db.session.add(food)
        db.session.commit()

        return {
            "food": food.to_dict_nutrition()
        }

    return {
        "errors": form.errors
    }, 400


@food_routes.route("/<int:foodId>", methods=["PUT"], endpoint="update_food")
@login_required
@verify_food
def update_food(food):
    """Update a Food"""
    form = FoodForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data

        food.name = data["name"]
        food.restaurant = data["restaurant"]
        food.calories = data["calories"]
        food.protein = data["protein"]

        db.session.commit()

        return {
            "food": food.to_dict_nutrition()
        }

    return {
        "errors": form.errors
    }, 400


@food_routes.route("/<int:foodId>", methods=["DELETE"], endpoint="delete_food")
@login_required
@verify_food
def delete_food(food):
    """Delete a Food"""
    food.is_deleted = True

    db.session.commit()

    return {
        "food": food.to_dict_nutrition()
    }
