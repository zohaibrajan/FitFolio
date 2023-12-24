from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, WeightExercise
from app.forms import WeightExerciseForm
from app.utils import verify_weight_exercise


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
def get_weight_exercise(weightExerciseId):
    """Get a single Weight Exercise"""
    exercise = WeightExercise.query.get(weightExerciseId)

    return {
        "weightExercise": exercise.to_dict()
    }




@weight_exercise_routes.route("<int:weightExerciseId>", methods=["PUT"], endpoint="update_weight_exercise")
@login_required
@verify_weight_exercise
def update_weight_exercise(weight_exercise):
    """Update a Weight Exercise"""
    form = WeightExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data

        exercise_exists = WeightExercise.query.filter(WeightExercise.exercise_name.ilike(data["exercise_name"])).first()

        if exercise_exists:
            return {
                "errorMessage": "Sorry, Exercise Already Exists"
            }, 400


        weight_exercise.exercise_name = data["exercise_name"]
        db.session.commit()

        return {
            "weightExercise": weight_exercise.to_dict()
        }
    else:
        return {
            "errors": form.errors
        }, 400

@weight_exercise_routes.route("<int:weightExerciseId>", methods=["DELETE"], endpoint="delete_weight_exercise")
@login_required
@verify_weight_exercise
def delete_weight_exercise(weight_exercise):
    """Delete a Weight Exercise"""
    db.session.delete(weight_exercise)
    db.session.commit()

    return {
        "message": "Weight Exercise Deleted"
    }

@weight_exercise_routes.route("/new", methods=["POST"])
@login_required
def create_weight_exercise():
    """Create a Weight Exercise"""
    form = WeightExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data

        exercise_exists = WeightExercise.query.filter(WeightExercise.exercise_name.ilike(data["exercise_name"])).first()

        if exercise_exists:
            return {
                "errorMessage": "Sorry, Exercise Already Exists"
            }, 400

        weight_exercise = WeightExercise(
            exercise_name=data["exercise_name"],
            created_by_user_id=current_user.id
        )

        db.session.add(weight_exercise)
        db.session.commit()

        return {
            "weightExercise": weight_exercise.to_dict()
        }
    else:
        return {
            "errors": form.errors
        }, 400
