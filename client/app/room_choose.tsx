import { View, Text, FlatList } from 'react-native';
import { Room } from '@/components/Room';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
    // const [loading, setLoading] = useState(false);
    // const [data, setData] = useState([]);
    // useEffect(() => {
    //     async () => {
    //         await fetch("hackathon.lapppse.xyz/rooms", {
    //             method: "GET",
    //             headers: new Headers({
    //             })
    //         });
    //     }
    // }, []);
    // let rooms: number[] = [1, 2, 3];
    // if (rooms.length === 0) {
    //     return null;
    // }

export default function RoomChooseScreen() {
    const rooms = [1, 2, 3];

    let rooms_view = [];
    for (let i = 0; i < rooms.length; i++) {
        rooms_view.push((
            <Room id={rooms[i].toString()} />
        ));
    }

    return (
        <View className="flex justify-center align-center p-4">
            <Text className="text-xl py-6">
                Your rooms:
            </Text>
            <View className="flex-col justify-start gap-4 h-full w-full">
                <FlatList
                    data={rooms}
                    keyExtractor={(number) => number.toString()}
                    renderItem={({item}) => (
                        <View className="mb-4">
                        <Room id={item.toString()} />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}