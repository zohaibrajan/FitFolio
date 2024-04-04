from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import User, CardioLog, db, WeightLog, FoodLog, Goal
from app.forms import CardioLogForm, WeightLogForm, FoodLogForm, GoalForm
from datetime import datetime
from app.api_helpers import *
from app.utils import (
    verify_cardio_log,
    verify_weight_log,
    verify_food_log,
    verify_goal,
    calculate_age,
    calculate_calories_per_day,
    convert_height_to_cm
)
user_routes = Blueprint('users', __name__)

@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict_with_info()

@user_routes.route('/cardio-logs/<string:date>')
@login_required
def user_cardio_logs_for_date(date):
    """Get all the cardio logs for a user on a specific date"""
    date = datetime.strptime(date, '%Y-%m-%d').date()

    cardio_logs = (
        CardioLog.query
        .filter(CardioLog.user_id == current_user.id)
        .filter(CardioLog.date == date)
        .order_by(CardioLog.date.desc())
        .all()
    )

    return {
        "allCardioLogs": [log.to_dict() for log in cardio_logs]
    }

@user_routes.route('/cardio-logs/<int:cardioLogId>', methods=["PUT"], endpoint="update_a_users_cardio_log")
@login_required
@verify_cardio_log
def update_cardio_log_route(cardio_log):
    """Updating a cardio log for a user"""
    form = CardioLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        return update_cardio_log(cardio_log, form.data) # from app/api_helpers/cardio_functions.py
    if form.errors:
        return form.errors

@user_routes.route('/cardio-logs/<int:cardioLogId>', methods=["DELETE"], endpoint="deleting_a_cardio_log")
@login_required
@verify_cardio_log
def deleting_a_cardio_log(cardio_log):
    db.session.delete(cardio_log)
    db.session.commit()

    return {
        "message": "Success"
    }, 200

@user_routes.route('/cardio-logs', methods=["POST"])
@login_required
def create_cardio_log_route():
    form = CardioLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        return create_cardio_log(form.data) # from app/api_helpers/cardio_functions.py
    if form.errors:
        return form.errors

@user_routes.route('/weight-logs/<string:date>')
@login_required
def user_weight_logs_for_date(date):
    """Get all the weight logs for a user on a specific date"""
    date = datetime.strptime(date, '%Y-%m-%d').date()

    weight_logs = (
        WeightLog.query
        .filter(WeightLog.user_id == current_user.id)
        .filter(WeightLog.date == date)
        .order_by(WeightLog.date.desc())
        .all()
    )

    return {
        "allWeightLogs": [log.to_dict() for log in weight_logs]
    }

@user_routes.route('/weight-logs', methods=["POST"])
@login_required
def create_weight_log_route():
    form = WeightLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        return create_weight_log(data) # from app/api_helpers/weight_functions.py
    if form.errors:
        return form.errors

@user_routes.route('/weight-logs/<int:weightLogId>', methods=["PUT"], endpoint="update_a_users_weight_log")
@login_required
@verify_weight_log
def update_a_weight_log_route(weight_log):
    """Updating a weight log for a user"""
    form = WeightLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
            return update_weight_log(weight_log, form.data) # from app/api_helpers/weight_functions.py
    if form.errors:
        return form.errors

@user_routes.route('/weight-logs/<int:weightLogId>', methods=["DELETE"], endpoint="deleting_a_weight_log")
@login_required
@verify_weight_log
def deleting_a_weight_log(weight_log):
    db.session.delete(weight_log)
    db.session.commit()

    return {
        "message": "Success"
    }, 200

@user_routes.route('/food-logs/<string:date>')
@login_required
def user_food_logs_for_date(date):
    """Get all the food logs for a user on a specific date"""
    date = datetime.strptime(date, '%Y-%m-%d').date()

    food_logs = (
        FoodLog.query
        .filter(FoodLog.user_id == current_user.id)
        .filter(FoodLog.date == date)
        .order_by(FoodLog.date.desc())
        .all()
    )

    return {
        "allFoodLogs": [log.to_dict() for log in food_logs]
    }

@user_routes.route('/food-logs', methods=["POST"])
@login_required
def create_food_log_route():
    form = FoodLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        return create_food_log(form.data) # from app/api_helpers/food_functions.py
    if form.errors:
        return form.errors

@user_routes.route('/food-logs/<int:foodLogId>', methods=["PUT"], endpoint="update_a_users_food_log")
@login_required
@verify_food_log
def update_food_log_route(food_log):
    """Updating a food log for a user"""
    form = FoodLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
            return update_food_log(food_log, form.data) # from app/api_helpers/food_functions.py
    if form.errors:
        return form.errors


@user_routes.route('/food-logs/<int:foodLogId>', methods=["DELETE"], endpoint="deleting_a_food_log")
@login_required
@verify_food_log
def deleting_a_food_log(food_log):
    db.session.delete(food_log)
    db.session.commit()

    return {
        "message": "Success"
    }, 200

@user_routes.route('/goal')
@login_required
def user_goal():
    """"Get the users goal"""
    goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if not goal:
        return {
            "message": "You have no goal"
        }, 404

    return {
        "goal": goal.to_dict()
    }


@user_routes.route('/goal', methods=["POST"])
@login_required
@verify_goal
def creating_user_goal():
    """Creating a goal"""
    user = User.query.get(current_user.id)
    user_info = user.to_dict_with_info()

    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
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

    if form.errors:
        return form.errors

@user_routes.route('/goal', methods=["PUT"])
@login_required
def updating_user_goal():
    """Updating a goal"""
    current_goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if not current_goal:
        return {
            "message": "Goal Does Not Exist."
        }, 404

    user = User.query.get(current_user.id)
    user_info = user.to_dict_with_info()

    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        goal = data["goal"]
        lbs_per_week = data["lbs_per_week"]
        starting_weight_kg = data["starting_weight"] * 0.453592
        age = calculate_age(user_info["dateOfBirth"])
        height = convert_height_to_cm(user_info["heightFt"], user_info["heightIn"])
        gender = user_info["gender"]
        calories_per_day = calories_per_day = calculate_calories_per_day(gender, starting_weight_kg, height, age, goal, lbs_per_week)

        starting_weight = data["starting_weight"] if data["starting_weight"] != user_info["currentWeight"] else user_info["currentWeight"]
        user.current_weight_lbs = starting_weight

        current_goal.goal = goal
        current_goal.starting_weight = starting_weight
        current_goal.target_weight = data["target_weight"]
        current_goal.lbs_per_week = lbs_per_week
        current_goal.calories_per_day = calories_per_day

        db.session.commit()

        return current_goal.to_dict()

    if form.errors:
        return form.errors


@user_routes.route('/goal', methods=["DELETE"])
@login_required
def deleting_users_goal():
    goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if not goal:
        return {
            "message": "Goal could not be found"
        }, 404

    db.session.delete(goal)
    db.session.commit()

    return {
        "message": "Goal deleted successfully"
    }
