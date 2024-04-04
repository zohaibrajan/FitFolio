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
    check_if_goal,
    check_current_goal
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

@user_routes.route('/goal', methods=["GET"], endpoint="user_goal")
@login_required
@check_current_goal
def user_goal(current_goal):
    """"Get the users goal"""
    return {
        "goal": current_goal.to_dict()
    }


@user_routes.route('/goal', methods=["POST"], endpoint="create_goal")
@login_required
@check_if_goal
def create_goal_route():
    """Creating a goal"""
    user = User.query.get(current_user.id)
    user_info = user.to_dict_with_info()

    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        return create_goal(form.data, user, user_info) # from app/api_helpers/goal_functions.py
    if form.errors:
        return form.errors

@user_routes.route('/goal', methods=["PUT"], endpoint="updating_user_goal")
@login_required
@check_current_goal
def updating_user_goal(current_goal):
    """Updating a goal"""
    user = User.query.get(current_user.id)
    user_info = user.to_dict_with_info()

    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        return update_goal(form.data, user, user_info, current_goal)
    if form.errors:
        return form.errors


@user_routes.route('/goal', methods=["DELETE"], endpoint="deleting_users_goal")
@login_required
@check_current_goal
def deleting_users_goal(current_goal):
    db.session.delete(current_goal)
    db.session.commit()

    return {
        "message": "Goal deleted successfully"
    }
