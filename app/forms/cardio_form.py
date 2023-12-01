from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateField
from wtforms.validators import DataRequired, NumberRange, AnyOf


class CardioForm(FlaskForm):
    duration = IntegerField("Duration", validators=[DataRequired(), NumberRange(min=1)])
    intensity = StringField("Intensity", validators=[DataRequired(), AnyOf(["Light", "Moderate", "Hard"])])
    date = DateField("Date", validators=[DataRequired()])
