from flask import Blueprint
from flask_login import current_user, login_required
from app.models import CardioExercise, CardioLog


cardio_exercise_routes = Blueprint("cardio-exercise", __name__)


@cardio_exercise_routes.route("")
@login_required
def get_all_cardio_exercises():
    """Getting all Cardio Exercises"""
    exercises = CardioExercise.get.all()

    return {
        "cardioExercises": [exercise.to_dict() for exercise in exercises]
    }
