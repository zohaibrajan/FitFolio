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

        if food.can_others_use == True:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        if food.is_deleted:
            return {
                "errorMessage": "Sorry, Food Has Been Deleted"
            }, 404


        return func(food)

    return wrapper


def get_food(food_from_form):
    return Food.query.where(Food.name.ilike(f"{food_from_form}")).first()
