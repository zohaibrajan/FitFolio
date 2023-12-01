from flask import Blueprint, abort, request, render_template
from flask_login import login_required, current_user
from app.models import User, CardioLog, CardioExercise, db
from app.forms import CardioLogForm
from datetime import datetime

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/cardio-logs')
@login_required
def user_cardio_logs():
    """"Get all the cardio logs for a user"""
    cardio_logs = CardioLog.query.where(CardioLog.user_id == current_user.id).order_by(CardioLog.date.desc()).all()

    return {
        "allCardioLogs": [log.to_dict() for log in cardio_logs]
    }



@user_routes.route('/cardio-logs/<int:cardioLogId>')
@login_required
def get_a_cardio_log(cardioLogId):
    """Get a single cardio log for a user"""
    cardio_log = CardioLog.query.get(cardioLogId)

    if not cardio_log:
        return {
            "errorMessage": "Sorry, cardio-log Does Not Exist"
        }, 404

    if cardio_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    return cardio_log.to_dict()

@user_routes.route('/cardio-logs/<int:cardioLogId>', methods=["PUT"])
@login_required
def update_a_users_cardio_log(cardioLogId):
    """Updating a cardio log for a user"""
    cardio_log = CardioLog.query.get(cardioLogId)

    if not cardio_log:
        return {
            "errorMessage": "Sorry, cardio-log Does Not Exist"
        }, 404

    if cardio_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    form = CardioLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
            data = form.data
            exercise_from_form = data['exercise_name']

            exercise = CardioExercise.query.where(CardioExercise.exercise_name.ilike(f"{exercise_from_form}")).first()

            if not exercise:
                return {
                    "errorMessage": "Sorry, exercise Does Not Exist"
                }, 404

            if not data['calories_burned']:
                data['calories_burned'] = int(data['duration']) * exercise.calories_per_minute

            cardio_log.duration = data['duration'],
            cardio_log.calories_burned = data['calories_burned'],
            cardio_log.exercise_id = int(exercise.id),
            cardio_log.date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
            cardio_log.user_id = int(current_user.id)

            db.session.commit()

            return cardio_log.to_dict(), 201

    if form.errors:
        return form.errors



@user_routes.route('/cardio-logs', methods=["POST"])
@login_required
def create_user_cardio_log():
    form = CardioLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        exercise_from_form = data['exercise_name']

        exercise = CardioExercise.query.where(CardioExercise.exercise_name.ilike(f"{exercise_from_form}")).first()

        if not exercise:
            return {
                "errorMessage": "Sorry, exercise Does Not Exist"
            }, 404

        if not data['calories_burned']:
            data['calories_burned'] = int(data['duration']) * exercise.calories_per_minute

        new_cardio_log = CardioLog(
            duration = data['duration'],
            calories_burned = data['calories_burned'],
            exercise_id = int(exercise.id),
            date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
            user_id = int(current_user.id)
        )

        db.session.add(new_cardio_log)
        db.session.commit()

        return new_cardio_log.to_dict(), 201

    if form.errors:
        return form.errors
