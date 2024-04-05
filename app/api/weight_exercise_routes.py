from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, WeightExercise, UserWeightExerciseVersion
from app.forms import WeightExerciseForm
from app.utils import get_weight_exercise


weight_exercise_routes = Blueprint("weight-exercise", __name__)

@weight_exercise_routes.route("")
@login_required
def get_all_weight_exercises():
    """"Getting all Weight Exercises"""
    exercises = WeightExercise.query.all()

    return {
        "weightExercises": [exercise.to_dict() for exercise in exercises]
    }

@weight_exercise_routes.route("/new", methods=["POST"])
@login_required
def create_weight_exercise():
    """Create a Weight Exercise"""
    form = WeightExerciseForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data
        exercise_from_form = data["exercise_name"].title()
        exercise_exists = get_weight_exercise(exercise_from_form)

        if exercise_exists:
            return {
                "errorMessage": "Sorry, Exercise Already Exists"
            }, 400

        weight_exercise = WeightExercise(
            exercise_name=data["exercise_name"].title(),
            created_by_user_id=current_user.id
        )

        db.session.add(weight_exercise)
        db.session.flush()

        user_exercise_version = UserWeightExerciseVersion(
            created_by_user_id=current_user.id,
            weight_exercise_id=weight_exercise.id,
            exercise_name=data["exercise_name"].title() + "*", # * indicates the original version
            is_deleted=False
        )

        db.session.add(user_exercise_version)
        db.session.commit()

        return {
            "weightExercise": weight_exercise.to_dict()
        }

    if form.errors:
        return form.errors, 400
