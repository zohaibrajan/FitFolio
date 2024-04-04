from flask_login import current_user
from app.utils import get_weight_exercise
from app.models import db, WeightLog, WeightExercise, UserWeightExerciseVersion
from datetime import datetime


def create_weight_log(data):
    exercise_from_form = data['exercise_name']
    exercise = get_weight_exercise(exercise_from_form)

    if not exercise:
        return {
            "errorMessage": "Sorry, Exercise Does Not Exist"
        }, 404

    new_weight_log = WeightLog(
        sets = data['sets'],
        repetitions = data['repetitions'],
        weight_per_rep = data['weight_per_rep'],
        exercise_id = int(exercise.id) if isinstance(exercise, WeightExercise) else None,
        user_exercise_id = int(exercise.id) if isinstance(exercise, UserWeightExerciseVersion) else None,
        date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
        user_id = int(current_user.id)
        )

    db.session.add(new_weight_log)
    db.session.commit()

    return new_weight_log.to_dict(), 201


def update_weight_log(weight_log, data):
    exercise_from_form = data['exercise_name']
    exercise = get_weight_exercise(exercise_from_form)

    if not exercise:
        return {
            "errorMessage": "Sorry, exercise Does Not Exist"
        }, 404

    updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

    weight_log.sets = data['sets']
    weight_log.repetitions = data['repetitions']
    weight_log.weight_per_rep = data['weight_per_rep']
    weight_log.exercise_id = int(exercise.id) if isinstance(exercise, WeightExercise) else None
    weight_log.user_exercise_id = int(exercise.id) if isinstance(exercise, UserWeightExerciseVersion) else None
    weight_log.date = updated_date
    weight_log.user_id = int(current_user.id)

    db.session.commit()

    return weight_log.to_dict(), 200
