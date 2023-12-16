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

@cardio_exercise_routes.route("/my-exercises")
@login_required
def get_my_cardio_exercises():
    """Getting all Cardio Exercises"""
    exercises = CardioExercise.query.filter(CardioExercise.created_by_user_id == current_user.id).all()

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

@cardio_exercise_routes.route("/<int:cardioExerciseId>", methods=["PUT"])
@login_required
def update_cardio_exercise(cardioExerciseId):
    """Update a Cardio Exercise"""
    cardio_exercise = CardioExercise.query.get(cardioExerciseId)

    if not cardio_exercise:
        return {
            "errorMessage": "Sorry, Cardio Exercise Does Not Exist"
        }, 404

    if cardio_exercise.created_by_user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403


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

        cardio_exercise.exercise_name = data["exercise_name"].title()
        cardio_exercise.intensity = data["intensity"]
        cardio_exercise.calories_per_minute = calories_burned_per_minute

        db.session.commit()

        return {
            "cardioExercise": cardio_exercise.to_dict()
        }

    if form.errors:
        return form.errors

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
            exercise_name = data["exercise_name"].title(),
            intensity = data["intensity"],
            calories_per_minute = calories_burned_per_minute,
            created_by_user_id = current_user.id
        )

        db.session.add(exercise)
        db.session.commit()

        return {
            "cardioExercise": exercise.to_dict()
        }, 201

    if form.errors:
        return form.errors
