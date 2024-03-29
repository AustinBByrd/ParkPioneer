"""adding status to userevent

Revision ID: 83153c8a672a
Revises: 6d424dfba385
Create Date: 2024-02-15 00:57:13.254811

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '83153c8a672a'
down_revision = '6d424dfba385'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_events', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_events', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###
