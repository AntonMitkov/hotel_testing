import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

export async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValue(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export async function useAuth() {
    const [token, setToken] = useState(null);
    getValue("HotelHelperBearerToken")
    .then(async (token) => {
        if (token === null) {
            setToken(false);
        }
        await fetch("hackathon.lapppse.xyz", {
            method: "POST",
            headers: new Headers({
                "bearer_token": token
            })
        })
            .then((res) => {
                if (res.status === 401) {
                    setToken(false);
                } else {
                    setToken(token);
                }
            })
    });
    return token;
}