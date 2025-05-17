import sys
sys.path.append('../micro')

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from typing import Annotated
from fastapi import Depends
from models import Users
from auth import get_current_user
from get_data import Connection
import data

router = APIRouter(
    prefix='/controller',
    tags=['controller']
)

@router.get('/state')
def get_state():
    conn = Connection('192.168.1.100', 7000)
    return conn.get_all_states()


@router.post('/light_on')
def light_on():
    conn = Connection('192.168.1.100', 7000)
    conn.change_state(data.States.LightOn)


@router.post('/light_off')
def light_off():
    conn = Connection('192.168.1.100', 7000)
    conn.change_state(data.States.LightOff)
    

@router.post('/lock_close')
def lock_close():
    conn = Connection('192.168.1.100', 7000)
    conn.change_state(data.States.DoorLockClose)


@router.post('/lock_open')
def lock_close():
    conn = Connection('192.168.1.100', 7000)
    conn.change_state(data.States.DoorLockOpen)