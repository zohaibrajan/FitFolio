from .db import db, environment, SCHEMA, add_prefix_for_prod

class Food(db.Model):
    __tablename__ = "foods"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    restaurant = db.Column(db.String(50), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Integer, nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "restaurant": self.restaurant,
            "calories": self.calories,
            "protein": self.protein,
            "createdByUserId": self.created_by_user_id
        }
