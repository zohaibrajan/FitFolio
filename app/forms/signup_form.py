from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, DateField
from wtforms.validators import DataRequired, ValidationError, NumberRange
from app.models import User
from datetime import datetime

def validate_date_of_birth(form, field):
    if field.data:
        today = datetime.now().date()
        if field.data >= today:
            raise ValidationError('Date of birth must be before today.')


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])
    dob = DateField("Date of Birth", validators=[DataRequired(), validate_date_of_birth])
    gender = SelectField("Gender", choices=["Male", "Female"], validators=[DataRequired()])
    height_ft = IntegerField("Height Ft", validators=[DataRequired(), NumberRange(min=3, max=7)])
    height_in = IntegerField("Height In", validators=[DataRequired(), NumberRange(min=0, max=11)])
    current_weight_lbs = IntegerField("Weight in lbs", validators=[DataRequired()])
