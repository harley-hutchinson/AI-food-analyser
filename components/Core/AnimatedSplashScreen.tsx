import { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function AnimatedSplashScreen() {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Optionally start the animation manually
    // animation.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        autoPlay
        loop
        source={require("@/assets/animations/new-splash.json")}
        style={styles.fullscreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002b2b",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreen: {
    width: "100%",
    height: "100%",
  },
});
