import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useRef } from "react";

export default function AnimatedSplashScreen() {
  const animation = useRef<LottieView>(null);

  // Change bg to #002b2b
  return (
    <View className="flex-1 bg-black">
      <LottieView
        ref={animation}
        source={require("@/assets/splash.json")}
        autoPlay
        loop
        style={styles.fullscreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    width: "100%",
    height: "100%",
  },
});
