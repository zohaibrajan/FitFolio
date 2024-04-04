from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import User, CardioLog, CardioExercise, db, WeightExercise, WeightLog, FoodLog, Food, Goal, UserCardioExerciseVersion, UserWeightExerciseVersion
from app.forms import CardioLogForm, WeightLogForm, FoodLogForm, GoalForm
from datetime import datetime
from sqlalchemy import and_, or_
from app.utils import verify_cardio_log, verify_weight_log, calculate_age, calculate_bmr_for_men, calculate_bmr_for_women, convert_height_to_cm

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
    return user.to_dict_with_info()


@user_routes.route('/cardio-logs/<string:date>')
@login_required
def user_cardio_logs_for_date(date):
    """Get all the cardio logs for a user on a specific date"""
    date = datetime.strptime(date, '%Y-%m-%d').date()

    cardio_logs = (
        CardioLog.query
        .filter(CardioLog.user_id == current_user.id)
        .filter(CardioLog.date == date)
        .order_by(CardioLog.date.desc())
        .all()
    )

    return {
        "allCardioLogs": [log.to_dict() for log in cardio_logs]
    }


@user_routes.route('/cardio-logs/<int:cardioLogId>', methods=["PUT"], endpoint="update_a_users_cardio_log")
@login_required
@verify_cardio_log
def update_a_users_cardio_log(cardio_log):
    """Updating a cardio log for a user"""
    form = CardioLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        exercise_from_form = data['exercise_name']

        exercise = CardioExercise.query.where(CardioExercise.exercise_name.ilike(f"{exercise_from_form}")).first()

        if not exercise:
            exercise = UserCardioExerciseVersion.query.where(
                and_(
                    UserCardioExerciseVersion.exercise_name.ilike(f"{exercise_from_form}"),
                    UserCardioExerciseVersion.created_by_user_id == current_user.id
                )
            ).first()

        if not exercise:
            return {
                "errorMessage": "Sorry, exercise Does Not Exist"
            }, 404

        updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

        cardio_log.duration = data['duration']
        cardio_log.calories_burned = data['calories_burned']
        cardio_log.exercise_id = int(exercise.id) if isinstance(exercise, CardioExercise) else None
        cardio_log.user_exercise_id = int(exercise.id) if isinstance(exercise, UserCardioExerciseVersion) else None
        cardio_log.date = updated_date
        cardio_log.user_id = int(current_user.id)

        db.session.commit()

        return cardio_log.to_dict(), 200

    if form.errors:
        return form.errors

@user_routes.route('/cardio-logs/<int:cardioLogId>', methods=["DELETE"], endpoint="deleting_a_cardio_log")
@login_required
@verify_cardio_log
def deleting_a_cardio_log(cardio_log):
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

        if not exercise: # if the exercise is not found in the CardioExercise table, check the UserCardioExerciseVersion table
            exercise = UserCardioExerciseVersion.query.where(
                and_(
                    UserCardioExerciseVersion.exercise_name.ilike(f"{exercise_from_form}"),
                    UserCardioExerciseVersion.is_deleted == False,
                    UserCardioExerciseVersion.created_by_user_id == current_user.id
                )
            ).first()

        if not exercise: # if the exercise is not found in the UserCardioExerciseVersion table, return an error message
            return {
                "errorMessage": "Sorry, Exercise Does Not Exist"
            }, 404

        new_cardio_log = CardioLog(
            duration = data['duration'],
            calories_burned = data['calories_burned'],
            exercise_id = int(exercise.id) if isinstance(exercise, CardioExercise) else None,
            user_exercise_id = int(exercise.id) if isinstance(exercise, UserCardioExerciseVersion) else None,
            date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date(),
            user_id = int(current_user.id)
        )

        db.session.add(new_cardio_log)
        db.session.commit()

        return new_cardio_log.to_dict(), 201

    if form.errors:
        return form.errors


@user_routes.route('/weight-logs/<string:date>')
@login_required
def user_weight_logs_for_date(date):
    """Get all the weight logs for a user on a specific date"""
    date = datetime.strptime(date, '%Y-%m-%d').date()

    weight_logs = (
        WeightLog.query
        .filter(WeightLog.user_id == current_user.id)
        .filter(WeightLog.date == date)
        .order_by(WeightLog.date.desc())
        .all()
    )

    return {
        "allWeightLogs": [log.to_dict() for log in weight_logs]
    }

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
            exercise = UserWeightExerciseVersion.query.where(
                and_(
                    UserWeightExerciseVersion.exercise_name.ilike(f"{exercise_from_form}"),
                    UserWeightExerciseVersion.is_deleted == False,
                    UserWeightExerciseVersion.created_by_user_id == current_user.id
                )
            ).first()

        if not exercise:
            return {
                "errorMessage": "Sorry, Exercise Does Not Exist"
            }, 404


        new_weight_log = WeightLog(
            sets = data['sets'],
            repetitions = data['repetitions'],
            weight_per_rep = data['weight_per_rep'],
            exercise_id = int(exercise.id) if isinstance(exercise, WeightExercise) else None,
            user_exercise_id = int(exercise.id) if isinstance(exercise, UserWeightExerciseVersion) else None,
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
@verify_weight_log
def update_a_users_weight_log(weight_log):
    """Updating a weight log for a user"""
    form = WeightLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
            data = form.data
            exercise_from_form = data['exercise_name']

            exercise = WeightExercise.query.where(WeightExercise.exercise_name.ilike(f"{exercise_from_form}")).first()

            if not exercise:
                exercise = UserWeightExerciseVersion.query.where(
                    and_(
                        UserWeightExerciseVersion.exercise_name.ilike(f"{exercise_from_form}"),
                        UserWeightExerciseVersion.created_by_user_id == current_user.id
                    )
                ).first()


            if not exercise:
                return {
                    "errorMessage": "Sorry, exercise Does Not Exist"
                }, 404

            updated_date = datetime.strptime(str(data["date"]), "%Y-%m-%d").date()

            weight_log.sets = int(data['sets'])
            weight_log.repetitions = int(data['repetitions'])
            weight_log.exercise_id = int(exercise.id) if isinstance(exercise, WeightExercise) else None
            weight_log.user_exercise_id = int(exercise.id) if isinstance(exercise, UserWeightExerciseVersion) else None
            weight_log.weight_per_rep = int(data["weight_per_rep"])
            weight_log.date = updated_date
            weight_log.user_id = int(current_user.id)

            db.session.commit()

            return weight_log.to_dict(), 200

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



@user_routes.route('/food-logs/<string:date>')
@login_required
def user_food_logs_for_date(date):
    """Get all the food logs for a user on a specific date"""
    date = datetime.strptime(date, '%Y-%m-%d').date()

    food_logs = (
        FoodLog.query
        .filter(FoodLog.user_id == current_user.id)
        .filter(FoodLog.date == date)
        .order_by(FoodLog.date.desc())
        .all()
    )

    return {
        "allFoodLogs": [log.to_dict() for log in food_logs]
    }



@user_routes.route('/food-logs', methods=["POST"])
@login_required
def create_user_food_log():
    form = FoodLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        food_from_form = data['name']
        servings = int(data["servings"])

        food = Food.query.filter(
            Food.name.ilike(f"{food_from_form}"),
            or_(
                ~Food.name.endswith('*'),
                and_(Food.name.endswith('*'), Food.created_by_user_id == current_user.id)
                )).first()

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
            date = data["date"],
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


@user_routes.route('/goal')
@login_required
def user_goal():
    """"Get the users goal"""
    goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if not goal:
        return {
            "message": "You have no goal"
        }, 404

    return {
        "goal": goal.to_dict()
    }


@user_routes.route('/goal', methods=["POST"])
@login_required
def creating_user_goal():
    """Creating a goal"""
    goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if goal:
        return {
            "message": "You already have a goal."
        }, 403

    user = User.query.get(current_user.id)
    user_info = user.to_dict_with_info()

    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        goal = data["goal"]
        lbs_per_week = data["lbs_per_week"]
        starting_weight_kg = data["starting_weight"] * 0.453592
        age = calculate_age(user_info["dateOfBirth"])
        height = convert_height_to_cm(user_info["heightFt"], user_info["heightIn"])
        gender = user_info["gender"]
        maintenance_calories = None
        calories_per_day = None

        if gender == "Female":
            maintenance_calories = calculate_bmr_for_women(starting_weight_kg, height, age) + 600

        if gender == "Male":
            maintenance_calories = calculate_bmr_for_men(starting_weight_kg, height, age) + 600

        if goal == "Maintain Weight":
            calories_per_day = maintenance_calories
        if goal == "Lose Weight":
            calorie_deficit = (lbs_per_week * 3500) / 7
            calories_per_day = maintenance_calories - calorie_deficit
        if goal == "Gain Weight":
            calorie_surplus = (lbs_per_week * 3500) / 7
            calories_per_day = maintenance_calories + calorie_surplus



        starting_weight = data["starting_weight"] if data["starting_weight"] != user_info["currentWeight"] else user_info["currentWeight"]
        user.current_weight_lbs = starting_weight


        new_goal = Goal(
            user_id = current_user.id,
            goal = goal,
            starting_weight = starting_weight,
            target_weight = data["target_weight"],
            lbs_per_week = lbs_per_week,
            calories_per_day = calories_per_day
        )

        db.session.add(new_goal)
        db.session.flush()
        db.session.commit()

        return new_goal.to_dict()



    if form.errors:
        return form.errors

@user_routes.route('/goal', methods=["PUT"])
@login_required
def updating_user_goal():
    """Updating a goal"""
    current_goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if not current_goal:
        return {
            "message": "Goal Does Not Exist."
        }, 404

    user = User.query.get(current_user.id)
    user_info = user.to_dict_with_info()

    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        goal = data["goal"]
        lbs_per_week = data["lbs_per_week"]
        starting_weight_kg = data["starting_weight"] * 0.453592
        age = calculate_age(user_info["dateOfBirth"])
        height = convert_height_to_cm(user_info["heightFt"], user_info["heightIn"])
        gender = user_info["gender"]
        maintenance_calories = None
        calories_per_day = None

        if gender == "Female":
            maintenance_calories = calculate_bmr_for_women(starting_weight_kg, height, age)

        if gender == "Male":
            maintenance_calories = calculate_bmr_for_men(starting_weight_kg, height, age)

        if goal == "Maintain Weight":
            calories_per_day = maintenance_calories
        if goal == "Lose Weight":
            calorie_deficit = (lbs_per_week * 3500) / 7
            calories_per_day = maintenance_calories - calorie_deficit
        if goal == "Gain Weight":
            calorie_surplus = (lbs_per_week * 3500) / 7
            calories_per_day = maintenance_calories + calorie_surplus

        starting_weight = data["starting_weight"] if data["starting_weight"] != user_info["currentWeight"] else user_info["currentWeight"]
        user.current_weight_lbs = starting_weight

        current_goal.goal = goal
        current_goal.starting_weight = starting_weight
        current_goal.target_weight = data["target_weight"]
        current_goal.lbs_per_week = lbs_per_week
        current_goal.calories_per_day = calories_per_day

        db.session.commit()

        return current_goal.to_dict()



    if form.errors:
        return form.errors


@user_routes.route('/goal', methods=["DELETE"])
@login_required
def deleting_users_goal():
    goal = Goal.query.where(Goal.user_id == current_user.id).first()

    if not goal:
        return {
            "message": "Goal could not be found"
        }, 404

    db.session.delete(goal)
    db.session.commit()

    return {
        "message": "Goal deleted successfully"
    }
