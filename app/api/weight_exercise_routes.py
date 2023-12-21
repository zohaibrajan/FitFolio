from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, WeightExercise
from app.forms import WeightExerciseForm


weight_exercise_routes = Blueprint("weight-exercise", __name__)

@weight_exercise_routes.route("")
@login_required
def get_all_weight_exercises():
    """"Getting all Weight Exercises"""
    exercises = WeightExercise.query.all()

    return {
        "weightExercises": [exercise.to_dict() for exercise in exercises]
    }

@weight_exercise_routes.route("/my-exercises")
@login_required
def get_my_weight_exercises():
    """Getting all Weight Exercises"""
    exercises = WeightExercise.query.filter(WeightExercise.created_by_user_id == current_user.id).all()

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


@weight_exercise_routes.route("<int:weightExerciseId>", methods=["PUT"])
@login_required
def update_cardio_exercise(weightExerciseId):
    """Update a Weight Exercise"""
    weight_exercise = WeightExercise.query.get(weightExerciseId)

    if not weight_exercise:
        return {
            "errorMessage": "Sorry, Weight Exercise Does Not Exist"
        }, 404

    if weight_exercise.created_by_user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403


    form = WeightExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data
        weight_exercise.name = data["exercise_name"]

        exercise_exists = WeightExercise.query.filter(WeightExercise.name == data["exercise_name"]).first()

        if exercise_exists:
            return {
                "errorMessage": "Sorry, Exercise Already Exists"
            }, 400


        db.session.commit()

        return {
            "weightExercise": weight_exercise.to_dict()
        }
    else:
        return {
            "errors": form.errors
        }, 400
