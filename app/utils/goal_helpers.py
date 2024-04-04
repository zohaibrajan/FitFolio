from flask_login import current_user
from app.models import Goal

def check_if_goal(func):
    def wrapper():
        goal = Goal.query.where(Goal.user_id == current_user.id).first()

        if goal:
            return {
                "message": "You already have a goal"
            }, 403

        return func()

    return wrapper


def check_current_goal(func):
    def wrapper():
        current_goal = Goal.query.where(Goal.user_id == current_user.id).first()

        if not current_goal:
            return {
                "message": "Goal Does Not Exist."
            }, 404

        return func(current_goal)

    return wrapper
