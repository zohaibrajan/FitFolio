from flask import Blueprint
from flask_login import login_required
from app.models import WeightExercise


weight_exercise_routes = Blueprint("weight-exercise", __name__)

@weight_exercise_routes.route("")
@login_required
def get_all_weight_exercises():
    """"Getting all Weight Exercises"""
    exercises = WeightExercise.query.all()

    return {
        "weightExercises": [exercise.to_dict() for exercise in exercises]
    }


@weight_exercise_routes.route("<int:weightExerciseId>")
@login_required
def get_cardio_exercise(weightExerciseId):
    """Get a single Weight Exercise"""
    exercise = WeightExercise.query.get(weightExerciseId)

    return {
        "weightExercise": exercise.to_dict()
    }
