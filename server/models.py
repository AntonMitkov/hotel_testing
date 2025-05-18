from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date
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
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    phone_number = Column(String)

class CheckIn(Base):
    __tablename__ = 'checkin'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_info.id"))
    room_number = Column(String, ForeignKey("rooms.room_number"))
    start_date = Column(Date)
    end_date = Column(Date)

class Rooms(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room_number = Column(String, unique=True, index=True)
    room_type = Column(String)
    price = Column(Integer)
    is_available = Column(Integer, default=1)  # 1 for available, 0 for not available
