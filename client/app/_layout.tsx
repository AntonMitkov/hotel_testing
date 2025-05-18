import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  // if (!loaded) {
  //   return null;
  // }

  return (
    <Stack>
      <Stack.Screen name="test" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
