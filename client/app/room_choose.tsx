import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useEffect } from 'react';
import { Room } from '@/components/Room';

export default function RoomChooseScreen() {
    let rooms = [1, 2, 3];
    if (rooms.length === 0) {
        return null;
    }

    let rooms_view = [];
    for (let i = 0; i < rooms.length; i++) {
        rooms_view.push(
            <Room id={rooms[i]} onPress={() => {console.error('gouda');}}/>)
    }

    return (
        <View className="flex justify-center align-center p-4">
            <Text className="text-xl py-6">
                Your rooms:
            </Text>
            <View className="flex-col justify-start gap-4 h-full w-full">
                {rooms_view}
            </View>
        </View>
    )
}