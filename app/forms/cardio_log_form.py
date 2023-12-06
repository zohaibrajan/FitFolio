from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateField, SubmitField
from wtforms.validators import DataRequired, NumberRange, Length


class CardioLogForm(FlaskForm):
    duration = IntegerField("Duration", validators=[DataRequired(), NumberRange(min=1)])
    exercise_name = StringField("Exercise Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    date = DateField("Date", validators=[DataRequired()])
    calories_burned = IntegerField("Calories Burned")
