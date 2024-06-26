from flask_login import current_user
from app.models import CardioLog, WeightLog, FoodLog

def verify_cardio_log(func):
    def wrapper(cardioLogId):
        cardio_log = CardioLog.query.get(cardioLogId)

        if not cardio_log:
            return { # returns a tuple, the first element is the dictionary, the second element is the status code
                "errorMessage": "Sorry, Cardio Log Does Not Exist"
            }, 404

        if cardio_log.user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(cardio_log)

    return wrapper


def verify_weight_log(func):
    def wrapper(weightLogId):
        weight_log = WeightLog.query.get(weightLogId)

        if not weight_log:
            return {
                "errorMessage": "Sorry, Strength Log Does Not Exist"
            }, 404

        if weight_log.user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(weight_log)

    return wrapper


def verify_food_log(func):
    def wrapper(foodLogId):
        food_log = FoodLog.query.get(foodLogId)

        if not food_log:
            return {
                "errorMessage": "Sorry, Food Log Does Not Exist"
            }, 404

        if food_log.user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(food_log)

    return wrapper
