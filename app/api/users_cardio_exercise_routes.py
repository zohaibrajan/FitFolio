from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, UserCardioExerciseVersion
from app.forms import CardioExerciseForm
from app.utils import verify_cardio_exercise # custom decorator to verify if the exercise exists an current owner is the one who created it


user_cardio_exercise_routes = Blueprint("user-cardio-exercise", __name__)


@user_cardio_exercise_routes.route("")
@login_required
def get_all_user_cardio_exercises():
    """Getting all created by User Cardio Exercises"""
    exercises = UserCardioExerciseVersion.query.filter(
        UserCardioExerciseVersion.created_by_user_id == current_user.id
        ).all()

    return {
        "userCardioExercises": [exercise.to_dict() for exercise in exercises]
    }


@user_cardio_exercise_routes.route("/filtered")
@login_required
def get_filtered_user_cardio_exercises():
    """Getting all created by User Cardio Exercises"""
    exercises = UserCardioExerciseVersion.query.filter(
        UserCardioExerciseVersion.created_by_user_id == current_user.id,
        UserCardioExerciseVersion.is_deleted == False
        ).all()

    return {
        "userCardioExercises": [exercise.to_dict() for exercise in exercises]
    }


@user_cardio_exercise_routes.route("/<int:userCardioExerciseId>")
@login_required
def get_user_cardio_exercise(userCardioExerciseId):
    """Get a single Cardio Exercise"""
    exercise = UserCardioExerciseVersion.query.get(userCardioExerciseId)

    if not exercise:
        return {
            "errorMessage": "Sorry, Cardio Exercise Does Not Exist"
        }, 404

    return {
        "userCardioExercise": exercise.to_dict()
    }


@user_cardio_exercise_routes.route("/<int:userCardioExerciseId>", methods=["PUT"], endpoint="update_user_cardio_exercise")
@login_required
@verify_cardio_exercise
def update_user_cardio_exercise(user_cardio_exercise):
    """Update a Cardio Exercise"""
    form = CardioExerciseForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        duration = data["duration"]
        calories_burned = data["calories_burned"]
        calories_burned_per_minute = round(calories_burned / duration)
        exercise_id = user_cardio_exercise.id

        user_exercise_exists = UserCardioExerciseVersion.query.filter(
            UserCardioExerciseVersion.exercise_name.ilike(data["exercise_name"].title() + "*"),
            UserCardioExerciseVersion.is_deleted == False,
            UserCardioExerciseVersion.id != exercise_id
        ).first()

        if user_exercise_exists:
            return {
                "errorMessage": "Sorry, Cardio Exercise Already Exists"
            }, 400

        user_cardio_exercise.exercise_name = data["exercise_name"].title() + "*"
        user_cardio_exercise.intensity = data["intensity"]
        user_cardio_exercise.calories_per_minute = calories_burned_per_minute


        db.session.commit()

        return {
            "userCardioExercise": user_cardio_exercise.to_dict()
        }

    if form.errors:
        return {
            "errors": form.errors
        }, 400


@user_cardio_exercise_routes.route("/<int:userCardioExerciseId>", methods=["DELETE"], endpoint="delete_user_cardio_exercise")
@login_required
@verify_cardio_exercise
def delete_user_cardio_exercise(user_cardio_exercise):
    """Delete a Cardio Exercise"""
    user_cardio_exercise.is_deleted = True
    db.session.commit()

    return {
        "message": "Cardio Exercise Deleted",
        "userCardioExercise": user_cardio_exercise.to_dict()
    }
