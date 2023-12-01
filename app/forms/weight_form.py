from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField
from wtforms.validators import DataRequired, Length

class WeightForm(FlaskForm):
    exercise_name = StringField("Exercise Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    sets = IntegerField("Number of Sets", validators=[DataRequired()])
    repetitions = IntegerField("Number of Repetitions", validators=[DataRequired()])
    weight_per_rep = IntegerField("Weight per Repetition", validators=[DataRequired()])
    date = DateField("Date", validators=[DataRequired()])
