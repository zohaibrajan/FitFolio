from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Food, db, UserFoodVersion
from app.forms import FoodForm

food_routes = Blueprint("foods", __name__)


@food_routes.route("")
@login_required
def get_all_cardio_exercises():
    """Getting all Foods"""
    foods = Food.query.all()

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
        others_can_use = data["allow_others_to_use"]

        if not others_can_use:
            user_version = UserFoodVersion(
                created_by_user_id=current_user.id,
                food_name=data["name"],
                restaurant=data["restaurant"],
                calories=data["calories"],
                protein=data["protein"],
                is_deleted=False
            )

            db.session.add(user_version)
            db.session.commit()

            return {
                "food": user_version.to_dict()
            } 

        else:
            food = Food(
                name=data["name"],
                restaurant=data["restaurant"],
                calories=data["calories"],
                protein=data["protein"],
                created_by_user_id=current_user.id
            )

            db.session.add(food)
            db.session.commit()

        return {
            "food": food.to_dict_nutrition()
        }

    return {
        "errors": form.errors
    }, 400
