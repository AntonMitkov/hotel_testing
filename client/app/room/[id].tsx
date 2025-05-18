import { useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { RoomData } from '@/components/RoomData';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from 'react';

export default function RoomId() {
    const { id } = useLocalSearchParams();
    let { booked, humidity, pressure, temperature } = {
        booked: 5, humidity: 70, pressure: 50.14, temperature: 36.6  
    }
    const [light, setLight] = useState(true);
    const [door, setDoor] = useState(true);


    return (
        <View className="w-full">
            <Text
                className="font-bold p-6 pt-10 text-center text-white text-xl bg-blue-400 rounded-b-3xl"
            >
                {`Room ${id}`}
            </Text>
            <View className="flex-col gap-10 p-4">
                <Text className="text-center text-lg font-semibold">
                    {`${booked} days until checkout`}
                </Text>
            </View>
            <View className="p-4 flex-col gap-6">
                <RoomData title="Humidity" value={humidity} icon={<Ionicons name="thermometer-outline" />} />
                <RoomData title="Pressure" value={pressure} icon={<Ionicons name="speedometer-outline" />} />
            </View>
            <Button
                title={`${door ? "Close" : "Open"} door`}
                onPress={() => setDoor(!door)}
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