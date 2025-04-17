import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold mb-4 text-black">⚙️ Settings</Text>
        <Text className="text-gray-600 text-base">
          Settings will go here soon! 🔧
        </Text>
      </View>
    </SafeAreaView>
  );
}
