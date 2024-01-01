from .db import db, environment, SCHEMA, add_prefix_for_prod


class UserFoodVersion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')))
    food_name = db.Column(db.String(50), nullable=False)
    restaurant = db.Column(db.String(50), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Integer, nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)


    user = db.relationship('User', back_populates='food_versions')
    food_logs = db.relationship("FoodLog", back_populates='user_food')
    food = db.relationship('Food', back_populates='versions')


    def to_dict(self):
        return {
            "id": self.id,
            "foodName": self.food_name,
            "restaurant": self.restaurant,
            "calories": self.calories,
            "protein": self.protein,
            "isDeleted": self.is_deleted,
        }
