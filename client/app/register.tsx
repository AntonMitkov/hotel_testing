import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

const registerValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  name: yup
    .string(),
  surname: yup
    .string(),
  phone: yup
    .string()
    .matches(RegExp(/\+?(375)?\s?\(?\d{2}\)?\s?\d{3}\s?\-?\d{2}\s?\-?\d{2}/)),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const inputContainerStyle = "bg-violet-100 rounded-xl px-4 py-2 w-full flex-row mb-2";
const inputStyle = "flex-1 w-full text-black";
const errorStyle = "text-red-500 self-start mb-4";

async function submit(
    { email, name, surname, passport, password }:
        { email: string, name: string, surname: string, passport: string, password: string }
) {
    console.error(email, name, surname, passport, password);
    await fetch('127.0.0.1:8000/auth/login').then((res) => {console.error(res);})
}

export default function RegisterScreen() {
    return (
    <View className="flex-1 px-6 bg-white items-center justify-center">
      <Text className="p-6 font-bold text-xl">Hello, new user!</Text>
      <Formik
        validationSchema={registerValidationSchema}
        initialValues={{ email: '', name: '', surname: '', phone: '', password: '' }}
        onSubmit={() => {console.log("TODO");}}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <>
            <View className={inputContainerStyle}>
              <TextInput
                className={inputStyle}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>
            {(errors.email && touched.email) ? (
              <Text className={errorStyle}>{errors.email}</Text>
            ) : null}
            <View className={inputContainerStyle}>
              <TextInput
                className={inputStyle}
                placeholder="Name"
                keyboardType="default"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
            </View>
            <View className={inputContainerStyle}>
              <TextInput
                className={inputStyle}
                placeholder="Surname"
                keyboardType="default"
                onChangeText={handleChange('surname')}
                onBlur={handleBlur('surname')}
                value={values.surname}
              />
            </View>
            <View className={inputContainerStyle}>
              <TextInput
                className={inputStyle}
                placeholder="Phone"
                keyboardType="phone-pad"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
              />
            </View>
            {(errors.phone && touched.phone) ? (
              <Text className={errorStyle}>{errors.phone}</Text>
            ) : null}
            <View className={inputContainerStyle}>
              <TextInput
                className={inputStyle}
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
            </View>
            {(errors.password && touched.password) ? (
              <Text className={errorStyle}>{errors.password}</Text>
            ) : null}
            <Link href="/login">
              Already have an account? <Text className="text-blue-500">Login</Text>
            </Link>
            <TouchableOpacity
              className="w-full p-4 bg-violet-500 rounded-xl border mt-6 disabled:bg-violet-800"
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text className="text-center font-bold text-white text-xl">Register</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}