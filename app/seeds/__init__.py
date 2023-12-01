from flask.cli import AppGroup
from .users import seed_users, undo_users
from .cardio_exercises import seed_cardio_exercises, undo_cardio_exercises
from .weight_exercies import seed_weight_exercises, undo_weight_exercises
from .days import seed_days, undo_days
from .cardio_logs import seed_cardio_logs, undo_cardio_logs

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_cardio_logs()
        undo_days()
        undo_weight_exercises()
        undo_cardio_exercises()
        undo_users()
    seed_users()
    seed_cardio_exercises()
    seed_weight_exercises()
    seed_days()
    seed_cardio_logs()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_cardio_logs()
    undo_weight_exercises()
    undo_cardio_exercises()
    undo_users()
    undo_days()
    # Add other undo functions here
