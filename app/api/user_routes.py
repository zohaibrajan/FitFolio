from flask import Blueprint, abort, request, render_template
from flask_login import login_required, current_user
from app.models import User, CardioLog, CardioExercise, db, WeightExercise, WeightLog, FoodLog, Food
from app.forms import CardioLogForm, WeightLogForm, FoodLogForm
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


            updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

            cardio_log.duration = data['duration']
            cardio_log.calories_burned = data['calories_burned']
            cardio_log.exercise_id = int(exercise.id)
            cardio_log.date = updated_date
            cardio_log.user_id = int(current_user.id)

            db.session.commit()

            return cardio_log.to_dict(), 201

    if form.errors:
        return form.errors

@user_routes.route('/cardio-logs/<int:cardioLogId>', methods=["DELETE"])
@login_required
def deleting_a_cardio_log(cardioLogId):
    cardio_log = CardioLog.query.get(cardioLogId)

    if not cardio_log:
        return {
        "errorMessage": "Sorry, cardio-log Does Not Exist"
        }, 404

    if cardio_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    db.session.delete(cardio_log)
    db.session.commit()

    return {
        "message": "Success"
    }, 200


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


@user_routes.route('/weight-logs')
@login_required
def user_weight_logs():
    """"Get all the weight logs for a user"""
    weight_logs = WeightLog.query.where(WeightLog.user_id == current_user.id).order_by(WeightLog.date.desc()).all()

    return {
        "allWeightLogs": [log.to_dict() for log in weight_logs]
    }


@user_routes.route('/weight-logs/<int:weightLogId>')
@login_required
def get_a_weight_log(weightLogId):
    """Get a single weight log for a user"""
    weight_log = WeightLog.query.get(weightLogId)

    if not weight_log:
        return {
            "errorMessage": "Sorry, weight-log Does Not Exist"
        }, 404

    if weight_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    return weight_log.to_dict()

@user_routes.route('/weight-logs', methods=["POST"])
@login_required
def create_user_weight_log():
    form = WeightLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        exercise_from_form = data['exercise_name']

        exercise = WeightExercise.query.where(WeightExercise.exercise_name.ilike(f"{exercise_from_form}")).first()

        if not exercise:
            return {
                "errorMessage": "Sorry, exercise Does Not Exist"
            }, 404


        new_weight_log = WeightLog(
            sets = data['sets'],
            repetitions = data['repetitions'],
            weight_per_rep = data['weight_per_rep'],
            exercise_id = int(exercise.id),
            date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
            user_id = int(current_user.id)
        )

        db.session.add(new_weight_log)
        db.session.commit()

        return new_weight_log.to_dict(), 201

    if form.errors:
        return form.errors


@user_routes.route('/weight-logs/<int:weightLogId>', methods=["PUT"])
@login_required
def update_a_users_weight_log(weightLogId):
    """Updating a weight log for a user"""
    weight_log = WeightLog.query.get(weightLogId)

    if not weight_log:
        return {
            "errorMessage": "Sorry, weight-log Does Not Exist"
        }, 404

    if weight_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    form = WeightLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
            data = form.data
            exercise_from_form = data['exercise_name']

            exercise = WeightExercise.query.where(WeightExercise.exercise_name.ilike(f"{exercise_from_form}")).first()

            if not exercise:
                return {
                    "errorMessage": "Sorry, exercise Does Not Exist"
                }, 404

            updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

            weight_log.sets = int(data['sets'])
            weight_log.repetitions = int(data['repetitions'])
            weight_log.exercise_id = int(exercise.id)
            weight_log.weight_per_rep = int(data["weight_per_rep"])
            weight_log.date = updated_date
            weight_log.user_id = int(current_user.id)

            db.session.commit()

            return weight_log.to_dict(), 201

    if form.errors:
        return form.errors


@user_routes.route('/weight-logs/<int:weightLogId>', methods=["DELETE"])
@login_required
def deleting_a_weight_log(weightLogId):
    weight_log = WeightLog.query.get(weightLogId)

    if not weight_log:
        return {
        "errorMessage": "Sorry, weight-log Does Not Exist"
        }, 404

    if weight_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    db.session.delete(weight_log)
    db.session.commit()

    return {
        "message": "Success"
    }, 200


@user_routes.route('/food-logs')
@login_required
def user_food_logs():
    """"Get all the food logs for a user"""
    food_logs = FoodLog.query.where(FoodLog.user_id == current_user.id).order_by(FoodLog.date.desc()).all()

    return {
        "allFoodLogs": [log.to_dict() for log in food_logs]
    }

@user_routes.route('/food-logs/<int:foodLogId>')
@login_required
def get_a_food_log(foodLogId):
    """Get a single food log for a user"""
    food_log = FoodLog.query.get(foodLogId)

    if not food_log:
        return {
            "errorMessage": "Sorry, food-log Does Not Exist"
        }, 404

    if food_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    return food_log.to_dict()


@user_routes.route('/food-logs', methods=["POST"])
@login_required
def create_user_food_log():
    form = FoodLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        food_from_form = data['name']
        servings = int(data["servings"])

        food = Food.query.where(Food.name.ilike(f"{food_from_form}")).first()

        if not food:
            return {
                "errorMessage": "Sorry, food Does Not Exist"
            }, 404

        calories_consumed = servings * food.calories
        protein_consumed = servings * food.protein


        new_food_log = FoodLog(
            servings = servings,
            calories_consumed = calories_consumed,
            protein_consumed = protein_consumed,
            food_id = int(food.id),
            date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
            user_id = int(current_user.id)
        )

        db.session.add(new_food_log)
        db.session.commit()

        return new_food_log.to_dict(), 201

    if form.errors:
        return form.errors


@user_routes.route('/food-logs/<int:foodLogId>', methods=["PUT"])
@login_required
def update_a_users_food_log(foodLogId):
    """Updating a food log for a user"""
    food_log = FoodLog.query.get(foodLogId)

    if not food_log:
        return {
            "errorMessage": "Sorry, food-log Does Not Exist"
        }, 404

    if food_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    form = FoodLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
            data = form.data
            food_from_form = data['name']
            servings = int(data["servings"])

            food = Food.query.where(Food.name.ilike(f"{food_from_form}")).first()

            if not food:
                return {
                    "errorMessage": "Sorry, food Does Not Exist"
                }, 404

            calories_consumed = servings * food.calories
            protein_consumed = servings * food.protein

            updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

            food_log.servings = servings
            food_log.calories_consumed = calories_consumed
            food_log.protein_consumed = protein_consumed
            food_log.food_id = int(food.id)
            food_log.date = updated_date
            food_log.user_id = int(current_user.id)

            db.session.commit()

            return food_log.to_dict(), 201

    if form.errors:
        return form.errors


@user_routes.route('/food-logs/<int:foodLogId>', methods=["DELETE"])
@login_required
def deleting_a_food_log(foodLogId):
    food_log = FoodLog.query.get(foodLogId)

    if not food_log:
        return {
        "errorMessage": "Sorry, food-log Does Not Exist"
        }, 404

    if food_log.user_id != current_user.id:
        return {
            "errorMessage": "Unauthorized"
        }, 403

    db.session.delete(food_log)
    db.session.commit()

    return {
        "message": "Success"
    }, 200
