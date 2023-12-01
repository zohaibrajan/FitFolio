from .db import db, environment, SCHEMA, add_prefix_for_prod


class FoodLog(db.Model):
    __tablename__ = "food_logs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    servings = db.Column(db.Integer, nullable=False)
    calories_consumed = db.Column(db.Integer, nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("foods.id")), nullable=True)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)


    user = db.relationship("User", back_populates="food_logs")
    food = db.relationship("Food", back_populates='food_logs')

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "food": self.food.to_dict_nutrition()
        }
