from .db import db, environment, SCHEMA, add_prefix_for_prod


class Day(db.Model):
    __tablename__ = 'days'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    date = db.Column(db.Date, nullable=False)

    cardio_log = db.relationship("CardioLog", back_populates="day", cascade="all, delete-orphan")
    weight_log = db.relationship("WeightLog", back_populates="day", cascade="all, delete-orphan")
    food_log = db.relationship("FoodLog", back_populates="day", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "date": self.date,
            "cardioLog": [cardio_exercise.to_dict() for cardio_exercise in self.cardio_log],
            "weightLog": [weight_exercise.to_dict() for weight_exercise in self.weight_log],
            "foodLog": [food_item.to_dict() for food_item in self.food_log]
        }
