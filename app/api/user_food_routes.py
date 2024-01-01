from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, UserFoodVersion
from app.forms import FoodForm
from app.utils import verify_food

user_food_versions_routes = Blueprint("user-food-versions", __name__)


@user_food_versions_routes.route("")
@login_required
def get_all_user_food_versions():
    """Getting all created by User Food Versions"""
    foods = UserFoodVersion.query.filter(
        UserFoodVersion.created_by_user_id == current_user.id
        ).all()

    return {
        "userFoods": [food.to_dict() for food in foods]
    }


@user_food_versions_routes.route("/filtered")
@login_required
def get_filtered_user_food_versions():
    """Getting all created by User Food Versions"""
    foods = UserFoodVersion.query.filter(
        UserFoodVersion.created_by_user_id == current_user.id,
        UserFoodVersion.is_deleted == False
        ).all()

    return {
        "userFoods": [food.to_dict() for food in foods]
    }


@user_food_versions_routes.route("/<int:userFoodVersionId>")
@login_required
def get_user_food_version(userFoodVersionId):
    """Get a single Food Version"""
    food = UserFoodVersion.query.get(userFoodVersionId)

    if not food:
        return {
            "errorMessage": "Sorry, Food Version Does Not Exist"
        }, 404

    return {
        "userFood": food.to_dict()
    }


@user_food_versions_routes.route("/<int:userFoodVersionId>", methods=["PUT"], endpoint="update_user_food_version")
@login_required
@verify_food
def update_user_food_version(food):
    """Update a Food Version"""
    form = FoodForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data

        food.food_name = data["name"]
        food.restaurant = data["restaurant"]
        food.calories = data["calories"]
        food.protein = data["protein"]

        db.session.commit()

        return {
            "userFood": food.to_dict()
        }

    return {
        "errors": form.errors
    }, 400


@user_food_versions_routes.route("/<int:userFoodVersionId>", methods=["DELETE"], endpoint="delete_user_food_version")
@login_required
@verify_food
def delete_user_food_version(food):
    """Delete a Food Version"""
    food.is_deleted = True
    db.session.commit()

    return {
        "userFood": food.to_dict()
    }


