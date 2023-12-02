from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, AnyOf, ValidationError

def check_relationship_between_goals_and_user_weight(form, field):
    goal = form.data["goal"]
    starting_weight = form.data["starting_weight"]
    target_weight = field.data

    if goal == "Lose Weight" and starting_weight <= target_weight:
        raise ValidationError("Target Weight does not match Goal.")

    if goal == "Gain Weight" and starting_weight >= target_weight:
        raise ValidationError("Target Weight does not match Goal.")

    if goal == "Maintain Weight" and starting_weight != target_weight:
        raise ValidationError("Target Weight does not match Goal.")

def checking_maintaining_weight(form, field):
    lbs_per_week = field.data
    goal = form.data["goal"]

    if goal == "Maintain Weight" and lbs_per_week > 0:
        raise ValidationError("Pounds Per Week must be set to 0")


def checking_losing_and_gaining_weight(form, field):
    lbs_per_week = field.data
    goal = form.data["goal"]

    if (goal == "Lose Weight" or goal == "Gain Weight") and lbs_per_week < 0.5:
        raise ValidationError("Pounds Per Week must be greater than 0.5")

class GoalForm(FlaskForm):
    goal = StringField("Goal", validators=[DataRequired(), AnyOf(["Lose Weight", "Gain Weight", "Maintain Weight"])])
    starting_weight = IntegerField("Starting Weight", validators=[DataRequired()])
    target_weight = IntegerField("Target Weight", validators=[DataRequired(), check_relationship_between_goals_and_user_weight])
    lbs_per_week = FloatField("Lbs Per Week", validators=[AnyOf([0, .5, 1, 1.5]), checking_maintaining_weight, checking_losing_and_gaining_weight])
