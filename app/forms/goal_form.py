from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, AnyOf, ValidationError

class GoalForm(FlaskForm):

    def check_relationship_between_goals_and_user_weight(form, field):
        goal = form.data["goal"]
        curr_weight = form.data["current_weight"]
        target_weight = field.data

        if goal == "Lose Weight" and curr_weight < target_weight:
            raise ValidationError("Target Weight does not match Goal.")

        if goal == "Gain Weight" and curr_weight > target_weight:
            raise ValidationError("Target Weight does not match Goal.")

        if goal == "Maintain Weight" and curr_weight != target_weight:
            raise ValidationError("Target Weight does not match Goal.")


    goal = StringField("Goal", validators=[DataRequired(), AnyOf(["Lose Weight", "Gain Weight", "Maintain Weight"])])
    current_weight = IntegerField("Current Weight")
    starting_weight = IntegerField("Starting Weight", validators=[DataRequired()])
    target_weight = IntegerField("Target Weight", validators=[DataRequired()])
    lbs_per_week = FloatField("Lbs Per Week", validators=[DataRequired(), check_relationship_between_goals_and_user_weight])
