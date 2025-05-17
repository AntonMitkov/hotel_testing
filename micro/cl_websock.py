import asyncio
import websockets

from get_data import State

URI = 'ws://localhost:8765'


async def connect_to_websocket():
    async with websockets.connect(URI) as websocket:
        await websocket.send("/get_state")
        response = str(await websocket.recv())
        stt = State(response)
        print(stt)


async def main():
    asyncio.run(connect_to_websocket())


if __name__ == '__main__':
    main()
