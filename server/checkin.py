from datetime import timedelta, date
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Users, CheckIn
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy import Integer, String, DateTime
import os
import dotenv

router = APIRouter(
    prefix='/checkin',
    tags=['checkin']
)

class CreateNewCheckin(BaseModel):
    id: int
    user_id: int
    room_id: int


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

db_dependency = Depends(get_db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_checkin(
    checkin: CreateNewCheckin,
    db: Session = db_dependency
):
    if db.query(CheckIn).filter(CheckIn.id == checkin.id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Check-in id already exists')
    
    new_checkin = CheckIn(id=checkin.id, user_id=checkin.user_id, room_id=checkin.room_id)
    
    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)
    
    return {'id': new_checkin.id}
