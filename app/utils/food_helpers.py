from flask_login import current_user
from app.models import Food

def verify_food(func):
    def wrapper(foodId):
        food = Food.query.get(foodId)

        if not food:
            return {
                "errorMessage": "Food not found"
                }, 404

        if food.created_by_user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
                }, 403

        return func(food)

    return wrapper
