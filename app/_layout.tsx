import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";

import "./global.css";
import { useEffect, useState } from "react";
import AnimatedSplashScreen from "@/components/Core/AnimatedSplashScreen";
import { StatusBar } from "expo-status-bar";

// Only needed once at the app level
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

    const timeout = setTimeout(() => {
      setLoading(false);
    }, delay);

    //  heh the splash screen is shown for a random time between 2 and 5 seconds 😝
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      {loading ? (
        <AnimatedSplashScreen />
      ) : (
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="result"
            options={{
              presentation: "modal",
              title: "Analyze",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      )}
    </>
  );
}
