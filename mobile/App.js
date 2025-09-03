import { StatusBar } from 'expo-status-bar';
import Main from './src/Main';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import AppProviders from "./src/stateManagement/AppProviders";

export default function App() {

  const [fontsLoaded] = useFonts({
    'regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'medium': require('./src/assets/fonts/Poppins-Medium.ttf'),
    'semibold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'light': require('./src/assets/fonts/Poppins-Light.ttf'),
    'extrabold': require('./src/assets/fonts/Poppins-ExtraBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <StatusBar style='auto' />
      <Main />
    </AppProviders>
  );
}
