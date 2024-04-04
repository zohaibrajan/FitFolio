from flask_login import current_user
from sqlalchemy import and_, or_
# or_ is a function that allows you to specify multiple conditions in a query,
# where at least one of the conditions needs to be true for a record to be included in the result set
from app.models import UserWeightExerciseVersion, WeightExercise

def verify_weight_exercise(func):
    def wrapper(userWeightExerciseId):
        weight_exercise = UserWeightExerciseVersion.query.get(userWeightExerciseId)

        if not weight_exercise:
            return {
                "errorMessage": "Sorry, Exercise Does Not Exist"
            }, 404

        if weight_exercise.created_by_user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return func(weight_exercise)

    return wrapper


def get_weight_exercise(exercise_from_form):
    return WeightExercise.query.filter(
        or_(
            WeightExercise.exercise_name.ilike(exercise_from_form),
            and_(
                UserWeightExerciseVersion.exercise_name.ilike(exercise_from_form),
                UserWeightExerciseVersion.is_deleted == False,
                UserWeightExerciseVersion.created_by_user_id == current_user.id
            )
        )
    ).first()
