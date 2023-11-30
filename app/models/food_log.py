from .db import db, environment, SCHEMA, add_prefix_for_prod


class FoodLog(db.Model):
    __tablename__ = "food_logs"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("foods.id")), nullable=True)
    day_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("days.id")), nullable=True)


    day = db.relationship("Day", back_populates='food_log')
    food = db.relationship("Food", back_populates='food_logs')
