from flask_login import current_user
from app.models import WeightExercise

def verify_weight_exercise(func):
    def wrapper(weightExerciseId):
        weight_exercise = WeightExercise.query.get(weightExerciseId)

        if not  weight_exercise:
            return {
                "errorMessage": "Sorry, Exercise Does Not Exist"
            }, 404

        if weight_exercise.created_by_user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(weight_exercise)
    return wrapper
