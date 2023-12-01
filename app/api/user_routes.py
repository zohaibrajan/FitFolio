from flask import Blueprint, abort
from flask_login import login_required, current_user
from app.models import User, Day, CardioLog

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
    return user.to_dict()


@user_routes.route('/days')
@login_required
def users_days_logged():
    """Get all days the user has logged"""
    days_logged = Day.query.where(Day.user_id == current_user.id).all()

    return {
        "daysLogged": [day.to_dict_date() for day in days_logged]
    }

@user_routes.route('/days/<int:dayId>/cardio-logs')
@login_required
def user_cardio_logs_by_day(dayId):
    """Get all cardio logs for a user"""

    day = Day.query.get(dayId)

    if day.user_id != current_user.id:
        return abort(403)

    cardio_log = CardioLog.query.where(CardioLog.day_id == dayId)

    print(cardio_log)

    return {
        "This Query": "Works?"
    }
