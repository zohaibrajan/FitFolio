from flask_login import current_user
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

        if weight_exercise.is_deleted:
            return {
                "errorMessage": "Sorry, Exercise Has Been Deleted"
            }, 404

        return func(weight_exercise)

    return wrapper


def get_weight_exercise(exercise_from_form):
    exercise = WeightExercise.query.filter(
        WeightExercise.exercise_name.ilike(exercise_from_form)
    ).first()
    # If the exercise was not found in the WeightExercise table,
    # check the UserWeightExerciseVersion table
    if not exercise:
        exercise = UserWeightExerciseVersion.query.filter(
            UserWeightExerciseVersion.exercise_name.ilike(exercise_from_form),
            UserWeightExerciseVersion.is_deleted == False,
            UserWeightExerciseVersion.created_by_user_id == current_user.id
        ).first()

    return exercise
