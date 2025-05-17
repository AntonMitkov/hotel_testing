import asyncio
import bleak
import data

DEVICE_NAME = 'ROOM_14'
AUTH_TOKEN = 'CmWovhIKrcgw496D'

SERVICE_UUID = "00FF"
AUTH_CHAR_UUID = "FF02"
COMMAND_CHAR_UUID_C = "FF01"


async def connect_and_authenticate():
    device = await bleak.BleakScanner.find_device_by_name(DEVICE_NAME, 5.0)

    if not device:
        print("Device not found")
        return None

    print("Device found")

    try:
        client = bleak.BleakClient(device)
        await client.connect()
        print("Client connected")

        auth_message = data.IdentifyRequest()
        auth_message.Token = AUTH_TOKEN
        auth_data = auth_message.SerializeToString()

        auth_char_uuid = f"0000{AUTH_CHAR_UUID}-0000-1000-8000-00805f9b34fb"

        await client.write_gatt_char(auth_char_uuid, auth_data)
        print("Authentication token sent")
        return client

    except Exception as ex:
        print(ex)
        return None


async def send_command(client, state):
    try:
        dst = data.SetState()
        dst.state = state

        command_char_uuid = f"0000{COMMAND_CHAR_UUID_C}-0000-1000-8000-00805f9b34fb"

        await client.write_gatt_char(command_char_uuid, dst.SerializeToString())
        return True

    except Exception as e:
        print(f"Error sending command: {e}")
        return False


async def main():
    client = await connect_and_authenticate()
    await send_command(client, data.States.LightOff)


if __name__ == '__main__':
    asyncio.run(main())
