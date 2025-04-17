import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ActionButtonsProps {
  captureImage: (camera: boolean) => void;
}

export default function ActionButtons({ captureImage }: ActionButtonsProps) {
  return (
    <View className="mt-6 flex-col gap-4">
      <TouchableOpacity
        onPress={() => captureImage(true)}
        className="flex-row items-center gap-2 bg-blue-600 px-4 py-3 rounded-full shadow-md"
      >
        <Ionicons name="camera-outline" size={20} color="#fff" />
        <Text className="text-white font-medium text-base">Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => captureImage(false)}
        className="flex-row items-center gap-2 bg-green-600 px-4 py-3 rounded-full shadow-md"
      >
        <Ionicons name="image-outline" size={20} color="#fff" />
        <Text className="text-white font-medium text-base">
          Pick from Gallery
        </Text>
      </TouchableOpacity>
    </View>
  );
}
