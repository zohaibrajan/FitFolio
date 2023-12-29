"""empty message

Revision ID: eb9847265136
Revises:
Create Date: 2023-12-28 01:14:15.924388

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'eb9847265136'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('dob', sa.Date(), nullable=False),
    sa.Column('gender', sa.String(), nullable=False),
    sa.Column('height_ft', sa.Integer(), nullable=False),
    sa.Column('height_in', sa.Integer(), nullable=True),
    sa.Column('current_weight_lbs', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    op.create_table('cardio_exercises',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('exercise_name', sa.String(length=50), nullable=False),
    sa.Column('intensity', sa.String(), nullable=False),
    sa.Column('calories_per_minute', sa.Float(), nullable=False),
    sa.Column('created_by_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE cardio_exercises SET SCHEMA {SCHEMA};")

    op.create_table('foods',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('restaurant', sa.String(length=50), nullable=False),
    sa.Column('calories', sa.Integer(), nullable=False),
    sa.Column('protein', sa.Integer(), nullable=False),
    sa.Column('created_by_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE foods SET SCHEMA {SCHEMA};")


    op.create_table('goals',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('goal', sa.String(length=25), nullable=False),
    sa.Column('starting_weight', sa.Integer(), nullable=False),
    sa.Column('target_weight', sa.Integer(), nullable=False),
    sa.Column('lbs_per_week', sa.Float(), nullable=True),
    sa.Column('calories_per_day', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE goals SET SCHEMA {SCHEMA};")

    op.create_table('weight_exercises',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('exercise_name', sa.String(length=50), nullable=False),
    sa.Column('created_by_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE weight_exercises SET SCHEMA {SCHEMA};")


    op.create_table('food_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('servings', sa.Integer(), nullable=False),
    sa.Column('calories_consumed', sa.Integer(), nullable=False),
    sa.Column('protein_consumed', sa.Integer(), nullable=False),
    sa.Column('food_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['food_id'], ['foods.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE food_logs SET SCHEMA {SCHEMA};")


    op.create_table('user_cardio_exercise_versions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_by_user_id', sa.Integer(), nullable=True),
    sa.Column('cardio_exercise_id', sa.Integer(), nullable=True),
    sa.Column('exercise_name', sa.String(length=50), nullable=False),
    sa.Column('intensity', sa.String(), nullable=False),
    sa.Column('calories_per_minute', sa.Float(), nullable=False),
    sa.Column('is_deleted', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['cardio_exercise_id'], ['cardio_exercises.id'], ),
    sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE user_cardio_exercise_versions SET SCHEMA {SCHEMA};")


    op.create_table('weight_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('sets', sa.Integer(), nullable=False),
    sa.Column('repetitions', sa.Integer(), nullable=False),
    sa.Column('weight_per_rep', sa.Integer(), nullable=False),
    sa.Column('exercise_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['exercise_id'], ['weight_exercises.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE weight_logs SET SCHEMA {SCHEMA};")


    op.create_table('cardio_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('duration', sa.Integer(), nullable=False),
    sa.Column('calories_burned', sa.Integer(), nullable=False),
    sa.Column('exercise_id', sa.Integer(), nullable=True),
    sa.Column('user_exercise_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['exercise_id'], ['cardio_exercises.id'], ),
    sa.ForeignKeyConstraint(['user_exercise_id'], ['user_cardio_exercise_versions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE cardio_logs SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cardio_logs')
    op.drop_table('weight_logs')
    op.drop_table('user_cardio_exercise_versions')
    op.drop_table('food_logs')
    op.drop_table('weight_exercises')
    op.drop_table('goals')
    op.drop_table('foods')
    op.drop_table('cardio_exercises')
    op.drop_table('users')
    # ### end Alembic commands ###
