from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, NumberRange, AnyOf


class CardioForm(FlaskForm):
    duration = IntegerField("Duration", validators=[DataRequired(), NumberRange(min=1)])
    intensity = StringField("Intensity", validators=[DataRequired(), AnyOf(["Light", "Moderate", "Hard"])])
