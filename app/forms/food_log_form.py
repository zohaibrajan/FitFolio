from flask_wtf import FlaskForm
from wtforms import DateField, IntegerField, StringField
from wtforms.validators import DataRequired


class FoodLogForm(FlaskForm):
    name = StringField("Food Name", validators=[DataRequired()])
    servings = IntegerField("Servings", validators=[DataRequired()])
    date = DateField("Date", validators=[DataRequired()])
