from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import CardioExercise, db
from app.forms import CardioExerciseForm


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

@cardio_exercise_routes.route("/new", methods=["POST"])
@login_required
def create_cardio_exercise():
    """Create a Cardio Exercise"""
    form = CardioExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data
        duration = data["duration"]
        calories_burned = data["calories_burned"]

        calories_burned_per_minute = round(calories_burned / duration)

        exercise_exists = CardioExercise.query.filter(CardioExercise.exercise_name.ilike(data["exercise_name"])).first()

        if exercise_exists:
            return {
                "errors": "Exercise already exists"
            }

        exercise = CardioExercise(
            exercise_name = data["exercise_name"],
            intensity = data["intensity"],
            calories_per_minute = calories_burned_per_minute,
            created_by_user_id = current_user.id
        )

        db.session.add(exercise)
        db.session.commit()

        return {
            "cardioExercise": exercise.to_dict()
        }
    if form.errors:
        return form.errors
