from flask_login import current_user
from app.models import Goal

def verify_goal(func):
    def wrapper():
        goal = Goal.query.where(Goal.user_id == current_user.id).first()

        if goal:
            return {
                "message": "You already have a goal"
            }, 403

        return func()

    return wrapper
