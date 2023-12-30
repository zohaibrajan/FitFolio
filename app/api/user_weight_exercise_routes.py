from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, UserWeightExerciseVersion
from app.forms import WeightExerciseForm
from app.utils import verify_weight_exercise

user_weight_exercise_versions_routes = Blueprint("user-weight-exercise-versions", __name__)


@user_weight_exercise_versions_routes.route("")
@login_required
def get_all_user_weight_exercise_versions():
    """Getting all created by User Weight Exercise Versions"""
    exercises = UserWeightExerciseVersion.query.filter(
        UserWeightExerciseVersion.created_by_user_id == current_user.id
        ).all()

    return {
        "userWeightExercises": [exercise.to_dict() for exercise in exercises]
    }


@user_weight_exercise_versions_routes.route("/filtered")
@login_required
def get_filtered_user_weight_exercise_versions():
    """Getting all created by User Weight Exercise Versions"""
    exercises = UserWeightExerciseVersion.query.filter(
        UserWeightExerciseVersion.created_by_user_id == current_user.id,
        UserWeightExerciseVersion.is_deleted == False
        ).all()

    return {
        "userWeightExercises": [exercise.to_dict() for exercise in exercises]
    }


@user_weight_exercise_versions_routes.route("/<int:userWeightExerciseId>")
@login_required
def get_user_weight_exercise_version(userWeightExerciseId):
    """Get a single Weight Exercise Version"""
    exercise = UserWeightExerciseVersion.query.get(userWeightExerciseId)

    if not exercise:
        return {
            "errorMessage": "Sorry, Weight Exercise Version Does Not Exist"
        }, 404

    return {
        "userWeightExercise": exercise.to_dict()
    }


@user_weight_exercise_versions_routes.route("/<int:userWeightExerciseId>", methods=["PUT"], endpoint="update_user_weight_exercise_version")
@login_required
@verify_weight_exercise
def update_user_weight_exercise_version(weight_exercise):
    """Update a Weight Exercise Version"""
    form = WeightExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data

        exercise_exists = UserWeightExerciseVersion.query.filter(
            UserWeightExerciseVersion.created_by_user_id == current_user.id,
            UserWeightExerciseVersion.is_deleted == False,
            UserWeightExerciseVersion.exercise_name.ilike(data["exercise_name"])
        ).first()

        if exercise_exists:
            return {
                "errorMessage": "Sorry, Exercise Already Exists"
            }, 400

        weight_exercise.exercise_name = data["exercise_name"] + "*"
        db.session.commit()

        return {
            "userWeightExercise": weight_exercise.to_dict()
        }

    if form.errors:
        return {
            "errors": form.errors
        }, 400


@user_weight_exercise_versions_routes.route("/<int:userWeightExerciseId>", methods=["DELETE"], endpoint="delete_user_weight_exercise_version")
@login_required
@verify_weight_exercise
def delete_user_weight_exercise_version(weight_exercise):
    """Delete a Weight Exercise Version"""
    weight_exercise.is_deleted = True
    db.session.commit()

    return {
        "userWeightExercise": weight_exercise.to_dict()
    }
