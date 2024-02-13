from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
import os

Engine = create_engine(
    str(os.environ.get('DATABASE_URL')),
    encoding='utf-8',
    echo=False
)

session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=Engine)
)

Base = declarative_base()
Base.query = session.query()
