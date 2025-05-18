from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import UserInfo, CheckIn, Users
from auth import get_current_user
from pydantic import BaseModel, ConfigDict
from datetime import date
from sqlalchemy import text

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)

class CreateNewCheckin(BaseModel):
    last_name: str
    first_name: str
    email: str
    phone_number: str
    room_number: str
    start_date: date
    end_date: date


def get_db():
    db = SessionLocal()
    
    try: 
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get('/all_users')
def get_all_users(
    db: db_dependency,
    current_user: user_dependency
):
    print(current_user)
    if current_user['is_admin'] == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    users = db.query(Users).all()
    return users


@router.post('/checkin_guest', status_code=status.HTTP_201_CREATED)
def checkin_guest(
    data: CreateNewCheckin,
    db: db_dependency,
    current_user: user_dependency
):
    if current_user['is_admin'] == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if the user already exists
    existing_user = db.query(UserInfo).filter(
        UserInfo.last_name == data.last_name,
        UserInfo.first_name == data.first_name,
        UserInfo.email == data.email,
        UserInfo.phone_number == data.phone_number
    ).first()
    if existing_user:
        user_id = existing_user.id
    else:
        new_user = UserInfo(
            user_id=None,
            last_name=data.last_name,
            first_name=data.first_name,
            email=data.email,
            phone_number=data.phone_number
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id

    # Добавляем новую запись в таблицу CheckIn
    new_checkin = CheckIn(
        user_id=user_id,
        room_number=data.room_number,
        start_date=data.start_date,
        end_date=data.end_date
    )
    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)

    db.execute(
        text("UPDATE rooms SET is_available = 0 WHERE room_number = :room_number"),
        {"room_number": data.room_number}
    )

    db.commit()

    return {"checkin_id": new_checkin.id, "user_id": user_id}