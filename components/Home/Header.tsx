import { View, Text } from "react-native";
import { useAtomValue } from "jotai";
import { apiKeyStatusAtom } from "@/atoms/apiKey";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Header() {
  const apiKeyStatus = useAtomValue(apiKeyStatusAtom);

  console.log("Header component rendered with apiKeyStatus:", apiKeyStatus);

  return (
    <View className="flex-row items-center gap-2 mb-4">
      <Text className="text-3xl font-bold text-black">👋 Hey, I'm Evie</Text>

      {apiKeyStatus === "connected" && (
        <View className="flex-row items-center gap-1 bg-green-500 px-2 py-1 rounded-full">
          <Ionicons name="checkmark-circle" size={14} color="white" />
          <Text className="text-white text-xs font-semibold">Connected</Text>
        </View>
      )}

      {apiKeyStatus === "invalid" && (
        <View className="flex-row items-center gap-1 bg-red-500 px-2 py-1 rounded-full">
          <Ionicons name="alert-circle" size={14} color="white" />
          <Text className="text-white text-xs font-semibold">Invalid</Text>
        </View>
      )}
    </View>
  );
}
