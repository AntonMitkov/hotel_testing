import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useEffect } from 'react';

export function Room({id}: {id: string}) {
    return (
        <Link
            className="p-4 bg-purple-100 rounded-xl shadow-slate-900 drop-shadow-xl"
            href={`/room/${id}`}
        >
            <Text>{`Room ${id}`}</Text>
        </Link>
    )
}