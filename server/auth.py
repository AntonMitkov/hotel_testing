from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from models import Users, UserInfo
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
import os
import dotenv

dotenv.load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = os.getenv('SECRET_KEY')

if SECRET_KEY is None:
    raise RuntimeError("SECRET_KEY environment variable is not set")

ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


class CreateUserRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class UserInfoPydantic(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: str

def get_db():
    db = SessionLocal()
    
    try: 
        yield db
    finally:
        db.close()


db_dependency = Depends(get_db)


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_user(
    user: CreateUserRequest,
    db: Session = db_dependency
):
    if db.query(Users).filter(Users.username == user.username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already exists')
    
    hashed_password = bcrypt_context.hash(user.password)
    new_user = Users(username=user.username, hashed_password=hashed_password, is_admin=0)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {'username': new_user.username}


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate a user"
        )
    token = create_access_token(user.username, user.id, user.is_admin, timedelta(days=7))
    print(user.is_admin)
    return {"access_token": token, "token_type": "bearer"}


def authenticate_user(username: str, password: str, db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user
    

def create_access_token(username: str, user_id: int, is_admin: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id, 'is_admin': is_admin}  # changed 'str' to 'sub'
    expires = datetime.now() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        is_admin: int = payload.get('is_admin')
        # print('Curr user', is_admin)
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Colud not validate user')
        return {'username': username, 'id': user_id, 'is_admin': is_admin}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Colud not validate user')
    


user_dependency = Annotated[dict, Depends(get_current_user)]
@router.post('/add_info', status_code=status.HTTP_201_CREATED)
def add_user_info(
    user_info: UserInfoPydantic,
    user: user_dependency,
    db: Session = db_dependency
):
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User not found')
    
    user_info_obj = UserInfo(
        user_id=user['id'],
        first_name=user_info.first_name,
        last_name=user_info.last_name,
        email=user_info.email,
        phone_number=user_info.phone_number
    )
    
    db.add(user_info_obj)
    db.commit()
    db.refresh(user_info_obj)
    
    return {'message': 'User info added successfully'}