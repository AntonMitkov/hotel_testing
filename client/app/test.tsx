import { View, Text, FlatList, Button, Linking, ActivityIndicator } from "react-native";
import { Room } from "@/components/Room";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { NativeModules, NativeEventEmitter, EmitterSubscription } from "react-native";
import { loadProtobuf } from "@/hooks/useProtobuf";
import base64 from "react-native-base64";

import { handlePermissions, lookFor, bleManager, connectTo } from "@/hooks/useBle";
import { Device } from "react-native-ble-plx";

// import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

// async function handlePermissions() {
//     if (Platform.OS === "ios") {
//         while ((await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)) !== RESULTS.GRANTED);
//         while ((await request(PERMISSIONS.IOS.BLUETOOTH)) !== RESULTS.GRANTED);
//     } else {
//         while ((await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)) !== RESULTS.GRANTED);
//         if(Platform.Version as number > 30) {
//             while ((await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)) !== RESULTS.GRANTED);
//             while ((await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)) !== RESULTS.GRANTED);
//             while ((await request(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE)) !== RESULTS.GRANTED);
//         }
//     }
// };


function formatUuid(shortUuid: string) {
  return `0000${shortUuid.toLowerCase()}-0000-1000-8000-00805f9b34fb`;
}

export default function TestScreen() {
    const [light, setLight] = useState(true);
    const [door, setDoor] = useState(true);
    const [IdentifyRequest, SetIdentifyRequest] = useState<{ [k: string]: number }>();
    const [SetState, SetSetState] = useState<{ [k: string]: number }>();
    const [States, SetStates] = useState<{ [k: string]: number }>();
    const [device, setDevice] = useState<Device>();
    const [connected, setConnected] = useState(false);
    const [loadState, setLoadState] = useState("starting");

    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

    const DEVICE_NAME = "ROOM_14";
    const AUTH_TOKEN = "CmWovhIKrcgw496D";
    const SERVICE_UUID = "000000ff-0000-1000-8000-00805f9b34fb";
    const AUTH_CHAR_UUID = "0000ff02-0000-1000-8000-00805f9b34fb";
    const COMMAND_CHAR_UUID = "0000ff01-0000-1000-8000-00805f9b34fb";


    useEffect(() => {
        async () => {
            await handlePermissions();
            // if (await BleManager.checkState() === BleState.Off) {
            // try {
            //     await BleManager.enableBluetooth().then(() => console.info("Bluetooth is enabled"));
            // } catch (e) {
            //     if (Platform.OS === "ios") {
            //         Linking.openURL("App-Prefs:Bluetooth");
            //     } else {
            //         Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
            //     }
            // }
            // }

            setLoadState(`looking for ${DEVICE_NAME}`);
            let dev = await lookFor(DEVICE_NAME);

            setLoadState(`connecting to ${DEVICE_NAME}`);
            dev = await connectTo(dev)
            setDevice(dev);
            let char = await device?.writeCharacteristicWithoutResponseForService(
                SERVICE_UUID,
                AUTH_CHAR_UUID,
                btoa(AUTH_TOKEN)
            );

            setLoadState("loading protobufs");
            const [idreq, sets, st] = await loadProtobuf();
            SetIdentifyRequest(idreq);
            SetSetState(setst);
            SetStates(st);

            setLoadState("done");
            setConnected(true);
        }
    }, []);

    if (!connected) {
        return (
            <ActivityIndicator /> 
            <Text>
                {loadState}
            </Text>
        )
    }

    return (
        <View>
            <Button
                title={`${door ? "Close" : "Open"} door`}
                onPress={() => {
                    setDoor(!door);
                    if (door) {
                        const commandChar = formatUuid(COMMAND_CHAR_UUID);
                        const message = SetState.create({ state });
                        const data = SetState.encode(message).finish();
                        device?.writeCharacteristicWithoutResponseForService(
                            SERVICE_UUID,
                            COMMAND_CHAR_UUID,
                            data
                        )
                    }
                }}
            >
            </Button>
            <Button
                title={`Turn the lights ${light ? "off" : "on"}`}
                onPress={() => setLight(!light)}
            >
            </Button>
        </View>
    )
}