import { Redirect, Link } from 'expo-router';
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuth, save } from '@/hooks/useAuth';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const inputContainerStyle = "bg-violet-100 rounded-xl px-4 py-2 w-full flex-row mb-2";
const inputStyle = "flex-1 w-full text-black";
const errorStyle = "text-red-500 self-start mb-4";

export default function LoginScreen() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);
  const [token, setToken] = useState("");

  async function login({ email, password }: { email: string, password: string }) {
      console.error(email, password);
      await fetch("hackathon.lapppse.xyz/auth/login", {
        method: "POST",
        headers: new Headers({
          email: email,
          password: password
        })
      })
        .then((res) => {
          setStatus(res.status);
          if (res.status == 200) {
            res.text().then((text) => {
              setToken(text);
              save("HotelHelperBearerToken", text);
            });
          }
        });
  }



  return (
    <View className="flex-1 px-6 bg-white items-center justify-center">
      <Text className="p-6 font-bold text-xl">Welcome again!</Text>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={login}
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
            <Link href="/register">
              Don't have an account yet? <Text className="text-blue-500">Register</Text>
            </Link>
            <TouchableOpacity
              className="w-full p-4 bg-violet-500 rounded-xl border mt-6 disabled:bg-violet-800"
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text className="text-center font-bold text-white text-xl">Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
  </View>
  );
}