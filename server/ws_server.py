import sys
sys.path.append('../micro')

from fastapi import WebSocket, APIRouter
from controller_manange import get_state
from get_data import State, Connection

router = APIRouter(
    prefix="/ws",
    tags=['ws'],
)


@router.websocket("/{room_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str):
    await websocket.accept()
    conn = Connection('192.168.1.100', 7000)
    while True:
        data = await websocket.receive_text()
        state = conn.get_all_states()
        val = state.__getattribute__(data)
        await websocket.send_text(str(val))
