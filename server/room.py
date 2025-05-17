from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import Users, CheckIn, Rooms
from auth import get_current_user

router = APIRouter(
    prefix='/room',
    tags=['room']
)

def get_db():
    db = SessionLocal()
    
    try: 
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/')
def get_room(
    db: db_dependency,
    current_user: user_dependency
):
    try:
        room = db.query(Rooms).filter(current_user.id == Rooms.user_id).first()
        return room
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="This user doesn't have a room"
        )