from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, Length


class CardioExerciseForm(FlaskForm):
    exercise_name = StringField("Exercise Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    duration = IntegerField("Duration", validators=[DataRequired()])
    calories_burned = IntegerField("Calories Burned", validators=[DataRequired()])
    
