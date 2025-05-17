import { Image } from "expo-image";
import { View, Text } from "react-native";

export function RoomData({ title, value, icon }: { title: string, value: any, icon: any }) {
    return (
    <View className="flex-row p-4 w-full rounded-2xl bg-violet-200 justify-around gap-6">
        <Text className="self-start">
            {title}
        </Text>
        <Text className="self-center">
            {value}
        </Text>
        <View className="self-end">
            {icon}
        </View>
    </View>
    )
}