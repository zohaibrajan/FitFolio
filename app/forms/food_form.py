from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Length, AnyOf


class FoodForm(FlaskForm):
    name = StringField("Food Name", validators=[DataRequired(), Length(min=1, max=50, message="Name must be shorter than 50 characters")])
    restaurant = StringField("Restaurant", validators=[DataRequired(), Length(min=1, max=50, message="Restaurant must be shorter than 50 characters")])
    calories = IntegerField("Calories", validators=[DataRequired()])
    protein = IntegerField("Protein", validators=[DataRequired()])
    can_others_use = BooleanField("Allow Others to Use", validators=[AnyOf([True, False])])
    unit_of_serving = StringField("Unit of Serving", validators=[DataRequired(), Length(min=1, max=50, message="Unit of Serving must be shorter than 50 characters")])
