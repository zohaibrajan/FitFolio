from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import CardioExercise, db, UserCardioExerciseVersion
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

    if not exercise:
        return {
            "errorMessage": "Sorry, Cardio Exercise Does Not Exist"
        }, 404

    return {
        "cardioExercise": exercise.to_dict()
    }



@cardio_exercise_routes.route("/new", methods=["POST"])
@login_required
def create_cardio_exercise():
    """Create a Cardio Exercise and a User's Version of it"""
    form = CardioExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data
        duration = data["duration"]
        calories_burned = data["calories_burned"]

        calories_burned_per_minute = round(calories_burned / duration)

        exercise_exists = CardioExercise.query.filter(CardioExercise.exercise_name.ilike(data["exercise_name"])).first()
        user_exercise_exists = UserCardioExerciseVersion.query.filter(
        UserCardioExerciseVersion.user_id == current_user.id,
        UserCardioExerciseVersion.exercise_name.ilike(data["exercise_name"])
        ).first()

        if exercise_exists or user_exercise_exists:
            return {
                "errors": "Exercise already exists"
            }, 400


        cardio_exercise = CardioExercise(
            created_by_user_id=current_user.id,
            exercise_name=data["exercise_name"].title(),
            intensity=data["intensity"],
            calories_per_minute=calories_burned_per_minute
        )
        db.session.add(cardio_exercise)
        db.session.flush()  # This is needed to get the id of the new cardio_exercise

        user_exercise_version = UserCardioExerciseVersion(
            user_id=current_user.id,
            cardio_exercise_id=cardio_exercise.id,
            exercise_name=data["exercise_name"].title(),
            intensity=data["intensity"],
            calories_per_minute=calories_burned_per_minute,
            is_deleted=False
        )
        db.session.add(user_exercise_version)
        db.session.commit()

        return {
            "cardioExercise": cardio_exercise.to_dict()
        }

    if form.errors:
        return form.errors
