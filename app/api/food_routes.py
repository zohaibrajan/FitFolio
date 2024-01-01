from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Food, db
from app.forms import FoodForm

food_routes = Blueprint("foods", __name__)


@food_routes.route("")
@login_required
def get_all_cardio_exercises():
    """Getting all Foods"""
    foods = Food.query.where(Food.can_others_use == True).all()

    return {
        "foods": [food.to_dict_nutrition() for food in foods]
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
            can_others_use=data["can_others_use"]
        )

        db.session.add(food)
        db.session.commit()

        return {
            "food": food.to_dict_nutrition()
        }

    return {
        "errors": form.errors
    }, 400


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
