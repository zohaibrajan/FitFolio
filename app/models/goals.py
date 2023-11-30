from .db import db, environment, SCHEMA, add_prefix_for_prod


class Goal(db.Model):
    __tablename__ = "goals"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    goal = db.Column(db.String(25), nullable=False)
    current_weight = db.Column(db.Integer)
    starting_weight = db.Column(db.Integer, nullable=False)
    target_weight = db.Column(db.Integer, nullable=False)
    lbs_per_week = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", back_populates="goal")


    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "goal": self.goal,
            "currentWeight": self.current_weight,
            "startingWeight": self.starting_weight,
            "targetWeight": self.target_weight,
            "lbsPerWeek": self.lbs_per_week
        }
