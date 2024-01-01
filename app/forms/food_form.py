from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Length


class FoodForm(FlaskForm):
    name = StringField("Food Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    restaurant = StringField("Restaurant", validators=[DataRequired(), Length(min=1, max=50, message="Restaurant must be shorter than 50 characters")])
    calories = IntegerField("Calories", validators=[DataRequired()]),
    protein = IntegerField("Protein", validators=[DataRequired()]),
    allow_others_to_use = BooleanField("Allow Others to Use", validators=[DataRequired()])
