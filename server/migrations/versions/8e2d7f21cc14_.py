"""empty message

Revision ID: 8e2d7f21cc14
Revises: e643bbed4d62
Create Date: 2024-02-07 12:41:50.571705

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8e2d7f21cc14'
down_revision = 'e643bbed4d62'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('start', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('end', sa.DateTime(), nullable=True))
        batch_op.drop_column('date')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.drop_column('end')
        batch_op.drop_column('start')

    # ### end Alembic commands ###
