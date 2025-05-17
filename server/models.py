from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
import datetime

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_admin = Column(Integer, default=0)

class UserInfo(Base):
    __tablename__ = "user_info"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    phone_number = Column(String)

class CheckIn(Base):
    __tablename__ = 'checkin'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime, default=datetime)
    end_date = Column(DateTime, default=datetime)

class Rooms(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room_number = Column(String, unique=True)
    room_type = Column(String)
    price = Column(Integer)
    is_available = Column(Integer, default=1)  # 1 for available, 0 for not available
