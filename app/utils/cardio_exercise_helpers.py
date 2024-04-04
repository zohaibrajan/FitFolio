from flask_login import current_user
from sqlalchemy import and_, or_
from app.models import UserCardioExerciseVersion, CardioExercise

def verify_cardio_exercise(func):
    def wrapper(userCardioExerciseId):
        cardio_exercise = UserCardioExerciseVersion.query.get(userCardioExerciseId)

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


def get_cardio_exercise(exercise_from_form):
    return CardioExercise.query.filter(
        or_(
            CardioExercise.exercise_name.ilike(exercise_from_form),
            and_(
                UserCardioExerciseVersion.exercise_name.ilike(exercise_from_form),
                UserCardioExerciseVersion.is_deleted == False,
                UserCardioExerciseVersion.created_by_user_id == current_user.id
            )
        )
    ).first()
