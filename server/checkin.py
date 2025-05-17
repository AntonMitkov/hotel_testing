from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import Users, CheckIn
from auth import get_current_user
from pydantic import BaseModel
from datetime import date

class CheckInPydantic(BaseModel):
    start_date: date
    end_date: date

router = APIRouter(
    prefix='/checkin',
    tags=['checkin']
)

def get_db():
    db = SessionLocal()
    
    try: 
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/', status_code=status.HTTP_200_OK)
def checkin(data: CheckInPydantic, user: user_dependency, db: db_dependency):
    if not user:
        raise HTTPException(status_code=401, detail="Authentification failed")
    
    print("Authenticated user:", user)  # Add this line for debugging

    checkin_obj = CheckIn(
        user_id=user["id"],
        start_date=data.start_date,
        end_date=data.end_date
    )

    db.add(checkin_obj)
    db.commit()
    db.refresh(checkin_obj)
    return checkin_obj
