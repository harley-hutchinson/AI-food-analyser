import { MotiView } from "moti";
import { View } from "react-native";

export default function EvieTyping() {
  return (
    <View className="flex-row gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.3, scale: 1 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{
            loop: true,
            delay: i * 150,
            type: "timing",
            duration: 500,
          }}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
      ))}
    </View>
  );
}
