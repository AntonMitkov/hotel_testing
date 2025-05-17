from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
import datetime

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_admin = Column(Integer, default=0)

class CheckIn(Base):
    __tablename__ = 'checkin'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime, default=datetime)
    end_date = Column(DateTime, default=datetime)
    