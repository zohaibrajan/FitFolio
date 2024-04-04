from flask_login import current_user
from app.utils import get_cardio_exercise
from app.models import db, CardioLog, CardioExercise, UserCardioExerciseVersion
from datetime import datetime

def create_cardio_log(data):
    exercise_from_form = data['exercise_name']
    exercise = get_cardio_exercise(exercise_from_form)

    if not exercise:
        return {
            "errorMessage": "Sorry, Exercise Does Not Exist"
        }, 404

    new_cardio_log = CardioLog(
        duration = data['duration'],
        calories_burned = data['calories_burned'],
        exercise_id = int(exercise.id) if isinstance(exercise, CardioExercise) else None,
        user_exercise_id = int(exercise.id) if isinstance(exercise, UserCardioExerciseVersion) else None,
        date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
        user_id = int(current_user.id)
    )

    db.session.add(new_cardio_log)
    db.session.commit()

    return new_cardio_log.to_dict(), 201


def update_cardio_log(cardio_log, data):
    exercise_from_form = data['exercise_name']
    exercise = get_cardio_exercise(exercise_from_form)

    if not exercise:
        return {
            "errorMessage": "Sorry, exercise Does Not Exist"
        }, 404

    updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

    cardio_log.duration = data['duration']
    cardio_log.calories_burned = data['calories_burned']
    cardio_log.exercise_id = int(exercise.id) if isinstance(exercise, CardioExercise) else None
    cardio_log.user_exercise_id = int(exercise.id) if isinstance(exercise, UserCardioExerciseVersion) else None
    cardio_log.date = updated_date
    cardio_log.user_id = int(current_user.id)

    db.session.commit()

    return cardio_log.to_dict(), 200
