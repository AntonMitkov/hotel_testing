import sys
sys.path.append('../micro')

from fastapi import WebSocket, APIRouter
from controller_manange import get_state
from get_data import State

router = APIRouter(
    prefix="/ws",
    tags=['ws'],
)


@router.websocket("/{room_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        state = State(await get_state())
        val = state.__getattribute__(data)
        await websocket.send_text(str(val))
