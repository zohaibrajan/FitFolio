from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Food, db
from app.forms import FoodForm
from app.utils import verify_food

food_routes = Blueprint("foods", __name__)


@food_routes.route("")
@login_required
def get_all_foods():
    """Getting all Foods"""
    foods = Food.query.where(Food.can_others_use == True).all()

    return {
        "foods": [food.to_dict() for food in foods]
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
            name=data["name"].title(),
            restaurant=data["restaurant"].title(),
            calories=data["calories"],
            protein=data["protein"],
            created_by_user_id=current_user.id,
            can_others_use=data["can_others_use"],
            is_deleted=False,
            unit_of_serving=data["unit_of_serving"].title()
        )

        db.session.add(food)
        db.session.commit()

        return {
            "food": food.to_dict()
        }

    return {
        "errors": form.errors
    }, 400


@food_routes.route("/my-foods-all")
@login_required
def get_my_foods_all():
    """Get all of a User's Foods"""
    foods = Food.query.filter(
        Food.created_by_user_id == current_user.id
        ).all()

    return {
        "foods": [food.to_dict() for food in foods]
    }


@food_routes.route("/my-foods")
@login_required
def get_my_foods():
    """Get all of a User's Foods"""
    foods = Food.query.filter(
        Food.created_by_user_id == current_user.id,
        Food.is_deleted == False
        ).all()

    return {
        "foods": [food.to_dict() for food in foods]
    }


@food_routes.route("/<int:foodId>")
@login_required
def get_food(foodId):
    """Get a single Food"""
    food = Food.query.where(Food.can_others_use == True,
        Food.is_deleted == False).get(foodId)

    if not food:
        return {
            "errorMessage": "Sorry, Food Does Not Exist"
        }, 404

    return {
        "food": food.to_dict()
    }


@food_routes.route("/<int:foodId>", methods=["PUT"], endpoint="update_food")
@login_required
@verify_food
def update_food(food):
    """Update a Food"""
    form = FoodForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if food.can_others_use == True:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    if form.validate_on_submit():
        data = form.data

        food.name = data["name"]
        food.restaurant = data["restaurant"]
        food.calories = data["calories"]
        food.protein = data["protein"]
        food.unit_of_serving = data["unit_of_serving"]

        db.session.commit()

        return {
            "food": food.to_dict()
        }

    return {
        "errors": form.errors
    }, 400


@food_routes.route("/<int:foodId>", methods=["DELETE"], endpoint="delete_food")
@login_required
@verify_food
def delete_food(food):
    """Delete a Food"""
    if food.can_others_use == True:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    food.is_deleted = True
    db.session.commit()

    return {
        "food": food.to_dict()
    }
