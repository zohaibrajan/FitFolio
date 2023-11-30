from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired, NumberRange


class CardioForm(FlaskForm):
    duration = IntegerField("Duration", validators=[DataRequired(), NumberRange(min=1)])
