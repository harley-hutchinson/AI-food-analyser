import { View, Text, Image } from "react-native";
import { MotiView } from "moti";
import type { ReactNode } from "react";

interface EvieMessageProps {
  children?: ReactNode;
}

export default function EvieMessage({ children }: EvieMessageProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
      className="flex-row items-start gap-3 mb-4"
    >
      <Image
        source={require("@/assets/images/evie-avatar.png")}
        className="w-10 h-10 rounded-full"
      />
      <View className="bg-[#eef1ff] px-4 py-3 rounded-2xl max-w-[80%]">
        <Text className="text-black text-[16px] leading-7">{children}</Text>
      </View>
    </MotiView>
  );
}
