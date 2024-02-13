# from setting import Engine, Base

from .setting import Engine, Base
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, JSON
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.sql.functions import current_timestamp
from sqlalchemy.exc import SQLAlchemyError

class EventStore(Base):
    __tablename__ = 'event_store'
    id = Column('id' ,Integer, primary_key=True, autoincrement=True)
    user_id = Column('user_id', Integer, nullable=False)
    chat_id = Column('chat_id', Integer, nullable=False)
    event_timestamp = Column('event_timestamp', DATETIME(fsp=3), server_default=current_timestamp(3), nullable=False)
    sequence_id = Column('sequence_id', Integer, nullable=False)

class ReceiveMessage(Base):
    __tablename__ = 'receive_message'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    event_id = Column('event_id',ForeignKey("event_store.id"), nullable=False)
    received_at = Column('received_at', DATETIME(fsp=3), server_default=current_timestamp(3), nullable=False)
    value = Column('message', String(4096), nullable=False)

class SendMessage(Base):
    __tablename__ = 'send_message'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    event_id = Column('event_id',ForeignKey("event_store.id"), nullable=False)
    send_at = Column('send_at', DATETIME(fsp=3), server_default=current_timestamp(3), nullable=False)
    value = Column('message', String(4096), nullable=False)

if __name__ == '__main__':
    Base.metadata.create_all(bind=Engine)
