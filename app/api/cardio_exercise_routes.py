from flask import Blueprint
from flask_login import current_user, login_required
from app.models import CardioExercise, CardioLog


cardio_exercise_routes = Blueprint("cardio-exercise", __name__)


@cardio_exercise_routes.route("")
@login_required
def get_all_cardio_exercises():
    """Getting all Cardio Exercises"""
    exercises = CardioExercise.query.all()

    return {
        "cardioExercises": [exercise.to_dict() for exercise in exercises]
    }

@cardio_exercise_routes.route("/<int:cardioExerciseId>")
@login_required
def get_cardio_exercise(cardioExerciseId):
    """Get a single Cardio Exercise"""
    exercise = CardioExercise.query.get(cardioExerciseId)

    return {
        "cardioExercise": exercise.to_dict()
    }
