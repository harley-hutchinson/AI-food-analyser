import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function EvieToast({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) {
  return (
    // <SafeAreaView className="flex-1 justify-center items-center">
    <View className="bg-white mx-4 mt-2 p-4 rounded-2xl shadow-lg border border-gray-200">
      <View className="flex-row items-center gap-3">
        <Image
          source={require("@/assets/images/evie-avatar.png")}
          className="w-10 h-10 rounded-full"
        />
        <View>
          <Text className="text-black font-semibold text-base">{text1}</Text>
          {text2 && <Text className="text-gray-600 text-sm mt-1">{text2}</Text>}
        </View>
      </View>
    </View>
    // </SafeAreaView>
  );
}
