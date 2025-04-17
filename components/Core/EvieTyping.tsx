import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function EvieTyping() {
  const dotCount = useSharedValue(0);

  useEffect(() => {
    dotCount.value = withRepeat(withTiming(3, { duration: 1200 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const dots = ".".repeat(Math.round(dotCount.value));
    return {
      opacity: 1,
    };
  });

  return (
    <View className="p-4 mb-2 max-w-[80%]">
      <Animated.Text
        className="text-black font-medium text-base"
        style={animatedStyle}
      >
        Evie is thinking{Array(Math.round(dotCount.value)).fill(".").join("")}
      </Animated.Text>
    </View>
  );
}
