from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo',
        email='demo@aa.io',
        password='password',
        dob = datetime.strptime("1997-09-18", "%Y-%m-%d").date(),
        gender = 'Male',
        height_ft = 5,
        height_in = 10,
        current_weight_lbs = 200
        )
    marnie = User(
        username='marnie',
        email='marnie@aa.io',
        gender = "Female",
        dob = datetime.strptime("1999-02-28", "%Y-%m-%d").date(),
        password='password',
        height_ft = 5,
        height_in = 5,
        current_weight_lbs = 140
        )
    bobbie = User(
        username='bobbie',
        email='bobbie@aa.io',
        password='password',
        dob = datetime.strptime("1996-12-05", "%Y-%m-%d").date(),
        gender = "Male",
        height_ft = 6,
        height_in = 2,
        current_weight_lbs = 205
        )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
