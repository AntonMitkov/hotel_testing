from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import Rooms
from pydantic import BaseModel
from auth import get_current_user

router = APIRouter(
    prefix='/rooms',
    tags=['rooms']
)

class RoomsPydantic(BaseModel):
    room_number: str
    room_type: str
    price: int
    is_available: int = 1

def get_db():
    db = SessionLocal()
    
    try: 
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/new', status_code=status.HTTP_201_CREATED)
def create_room(
    rooms: RoomsPydantic,
    user: user_dependency,
    db: db_dependency):

    if not user:
        raise HTTPException(status_code=401, detail="Authentification failed")
    if user['is_admin'] == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    room_obj = Rooms(
        room_number=rooms.room_number,
        room_type=rooms.room_type,
        price=rooms.price,
        is_available=1 
    )
    db.add(room_obj)
    db.commit()
    db.refresh(room_obj)
    return room_obj


@router.get('/all', status_code=status.HTTP_200_OK)
def get_all_rooms(
    user: user_dependency,
    db: db_dependency):
    if not user:
        raise HTTPException(status_code=401, detail="Authentification failed")
    if user['is_admin'] == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    rooms = db.query(Rooms).all()
    return rooms
