from flask import Blueprint, abort
from flask_login import login_required, current_user
from app.models import User, CardioLog

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


@user_routes.route('/cardio-logs')
@login_required
def user_cardio_logs():
    cardio_logs = CardioLog.query.where(CardioLog.user_id == current_user.id).order_by(CardioLog.date.desc()).all()

    return {
        "allCardioLogs": [log.to_dict() for log in cardio_logs]
    }
