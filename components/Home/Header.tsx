import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  hasApiKey: boolean;
}

export default function Header({ hasApiKey }: HeaderProps) {
  return (
    <View className="flex-row items-center gap-2 mb-4">
      <Text className="text-3xl font-bold text-black">👋 Hey, I'm Evie</Text>

      {hasApiKey && (
        <View className="flex-row items-center gap-1 bg-green-500 px-2 py-1 rounded-full">
          <Ionicons name="checkmark-circle" size={14} color="white" />
          <Text className="text-white text-xs font-semibold">Connected</Text>
        </View>
      )}
    </View>
  );
}
