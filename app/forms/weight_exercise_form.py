from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, AnyOf, Length


class WeightExerciseForm(FlaskForm):
    exercise_name = StringField("Exercise Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    
