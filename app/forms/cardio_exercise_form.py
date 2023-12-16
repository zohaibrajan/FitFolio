from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateField
from wtforms.validators import DataRequired, AnyOf, Length

VALID_INTENSITIES = [
    "Low",
    "Medium",
    "High"
]

class CardioExerciseForm(FlaskForm):
    exercise_name = StringField("Exercise Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    intensity = StringField("Intensity", validators=[DataRequired(), AnyOf(VALID_INTENSITIES, message="Intensity must be Low, Medium, or High")])
    duration = IntegerField("Duration", validators=[DataRequired()])
    calories_burned = IntegerField("Calories Burned", validators=[DataRequired()])
