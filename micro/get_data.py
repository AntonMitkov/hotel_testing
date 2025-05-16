import threading

import data
import socket


class State:
    light_on: bool
    door_lock: bool
    channel_1: bool
    channel_2: bool
    temperature: float
    pressure: float
    humidity: float

    def __init__(self, req: str):
        self.light_on = req.find("light_on") == -1
        self.door_lock = req.find("door_lock") == -1
        self.channel_1 = req.find("channel_1") == -1
        self.channel_2 = req.find("channel_2") == -1

        req = req[req.find("temperature"):-3]
        arr = req.split("\n")
        for i in range(len(arr)):
            arr[i] = arr[i].split(": ")[1]
        self.temperature, self.pressure, self.humidity = arr


class Connection:
    sock: socket.socket

    def __init__(self, server_ip: str, server_port: int):
        global sock
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((server_ip, server_port))

    def send_message(self, client_msg):
        global sock
        sock.sendall(client_msg.SerializeToString())
        response = sock.recv(4096);

        con_resp = data.ControllerResponse()
        con_resp.ParseFromString(response)
        return con_resp

    def change_state(self, state) -> bool:
        dst = data.SetState()
        dst.state = state

        client_msg = data.ClientMessage()
        client_msg.set_state.CopyFrom(dst)

        return self.send_message(client_msg) == data.Statuses.Ok

    def get_all_states(self) -> State:
        client_msg = data.ClientMessage()
        client_msg.get_state.SetInParent()
        return State(str(self.send_message(client_msg)))

    def get_full_info(self) -> str:
        client_msg = data.ClientMessage()
        client_msg.get_info.SetInParent()
        return self.send_message(client_msg)


if __name__ == '__main__':
    conn = Connection('192.168.1.100', 7000)
    print(conn.get_all_states().light_on)
    print(conn.change_state(data.States.LightOn))
    print(conn.get_all_states().light_on)
