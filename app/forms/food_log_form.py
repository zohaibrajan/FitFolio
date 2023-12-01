from flask_wtf import FlaskForm
from wtforms import DateField, IntegerField
from wtforms.validators import DataRequired


class FoodForm(FlaskForm):
    servings = IntegerField("Servings", validators=[DataRequired()])
    date = DateField("Date", validators=[DataRequired()])
