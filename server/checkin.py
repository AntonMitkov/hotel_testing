from datetime import timedelta, date
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Users, CheckIn, UserInfo  # Make sure UserInfo is imported
from auth import get_current_user

router = APIRouter(
    prefix='/checkin',
    tags=['checkin']
)

class CreateNewCheckin(BaseModel):
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

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_checkin(data: CreateNewCheckin, db: db_dependency, user: dict = Depends(get_current_user)):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentification failed")
    if user['is_admin'] == 0:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    checkin = CheckIn(
        user_id=user['id'],
        start_date=data.start_date,
        end_date=data.end_date
    )
    
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    
    return checkin


@router.get('/all', status_code=status.HTTP_200_OK)
def get_all_checkins(db: db_dependency, user: dict = Depends(get_current_user)):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentification failed")
    if user['is_admin'] == 0:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    checkins = (
        db.query(CheckIn, UserInfo)
        .join(UserInfo, CheckIn.user_id == UserInfo.id)
        .all()
    )
    
    result = []
    for checkin, userinfo in checkins:
        checkin_dict = {c.name: getattr(checkin, c.name) for c in CheckIn.__table__.columns}
        userinfo_dict = {c.name: getattr(userinfo, c.name) for c in UserInfo.__table__.columns}

        merged = {
            'id': checkin_dict['id'],
            'first_name': userinfo_dict['first_name'],
            'last_name': userinfo_dict['last_name'],
            'email': userinfo_dict['email'],
            'phone_number': userinfo_dict['phone_number'],
            'start_date': checkin_dict['start_date'],
            'end_date': checkin_dict['end_date'],
        }

        merged['start_date'] = merged['start_date'].strftime("%Y-%m-%d")
        merged['end_date'] = merged['end_date'].strftime("%Y-%m-%d")

        result.append(merged)
    
    return result