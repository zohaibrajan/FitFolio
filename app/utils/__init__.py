from flask_login import current_user

def verify_weight_exercise(func):
    print('-------', func)
    def wrapper(weightExerciseId):
        exercise = func(weightExerciseId)
        print('-------', exercise)
        if not exercise:
            return {
                "errorMessage": "Sorry, Exercise Does Not Exist"
            }, 404

        if exercise.created_by_user_id != current_user.id:
            return {
                "errorMessage": "Unauthorized"
            }, 403

        return exercise
    return wrapper
