from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Food, db
from app.forms import FoodForm
from app.utils import verify_food, verify_single_food

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
        unit = data["unit_of_serving"]

        # the reason for not checking if food already exists is because
        # the user may want to create a food with the same name but different
        # nutritional values

        if unit.endswith("s"):
            unit = unit[:-1]

        food = Food(
            name=data["name"].title(),
            restaurant=data["restaurant"].title(),
            calories=data["calories"],
            protein=data["protein"],
            created_by_user_id=current_user.id,
            can_others_use=data["can_others_use"],
            is_deleted=False,
            unit_of_serving=unit.title()
        )

        db.session.add(food)
        db.session.commit()

        return {
            "food": food.to_dict()
        }

    return {
        "errors": form.errors
    }, 400


@food_routes.route("/my-foods-all") # get all foods, including deleted ones
@login_required                     # this is needed because if a user decides to delete a food, they should still be able to see it in their history
def get_my_foods_all():             # allowing them to edit their food log history
    """Get all of a User's Foods"""
    foods = Food.query.filter(
        Food.created_by_user_id == current_user.id
        ).all()

    return {
        "foods": [food.to_dict() for food in foods]
    }


@food_routes.route("/my-foods") # get all foods that are not deleted
@login_required                 # allowing used to create food logs, from their MyFoods component in the frontend
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
@verify_single_food
def get_food_route(food):
    """Get a single Food""" 
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

    if form.validate_on_submit():
        data = form.data
        unit = data["unit_of_serving"]

        if unit.endswith("s"): # if user inputs the plural form of the unit, remove the "s"
            unit = unit[:-1]

        food.name = data["name"].title()
        food.restaurant = data["restaurant"].title()
        food.calories = data["calories"]
        food.protein = data["protein"]
        food.unit_of_serving = unit.title()

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
    food.is_deleted = True
    db.session.commit()

    return {
        "food": food.to_dict()
    }
