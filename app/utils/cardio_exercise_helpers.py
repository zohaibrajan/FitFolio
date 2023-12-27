from flask_login import current_user
from app.models import CardioExercise

def verify_cardio_exercise(func):
    def wrapper(cardioExerciseId):
        cardio_exercise = CardioExercise.query.get(cardioExerciseId)

        if not cardio_exercise:
            return {
                "errorMessage": "Sorry, Cardio Exercise Does Not Exist"
            }, 404

        if cardio_exercise.created_by_user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(cardio_exercise)

    return wrapper
