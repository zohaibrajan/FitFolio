from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, AnyOf, ValidationError

def check_relationship_between_goals_and_user_weight(form, field):
    goal = form.data["goal"]
    starting_weight = form.data["starting_weight"]
    target_weight = field.data

    if goal == "Lose Weight" and starting_weight < target_weight:
        raise ValidationError("Target Weight does not match Goal.")

    if goal == "Gain Weight" and starting_weight > target_weight:
        raise ValidationError("Target Weight does not match Goal.")

    if goal == "Maintain Weight" and starting_weight != target_weight:
        raise ValidationError("Target Weight does not match Goal.")

class GoalForm(FlaskForm):
    goal = StringField("Goal", validators=[DataRequired(), AnyOf(["Lose Weight", "Gain Weight", "Maintain Weight"])])
    starting_weight = IntegerField("Starting Weight", validators=[DataRequired()])
    target_weight = IntegerField("Target Weight", validators=[DataRequired()])
    lbs_per_week = FloatField("Lbs Per Week", validators=[DataRequired(), check_relationship_between_goals_and_user_weight])
