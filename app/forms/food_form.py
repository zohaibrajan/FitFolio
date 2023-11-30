from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class FoodForm(FlaskForm):
    name = StringField("Food Name", validators=[DataRequired()])
    restaurant = StringField("Restaurant", validators=[DataRequired()])
    calories = IntegerField("Calories", validators=[DataRequired()])
    protein = IntegerField("Protein", validators=[DataRequired()])
