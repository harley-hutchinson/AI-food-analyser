import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSetAtom } from "jotai";
import { analysisAtom } from "@/atoms/analysis";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvieMessage from "@/components/Core/EvieMessage";
import EvieTyping from "@/components/Core/EvieTyping";

const fakeResponse = require("@/assets/response.json");

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);
  const [isLoading, setIsLoading] = useState(false);

  const captureImage = async (camera = false) => {
    if (__DEV__) {
      setAnalysis(fakeResponse);
      router.push("/result");
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (camera) {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 1,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 1,
          base64: true,
        });
      }

      if (result.canceled) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: {
            inlineData: {
              data: result.assets[0].base64,
              mimeType: "image/jpeg",
            },
          },
        }),
      });

      const data = await response.json();
      const foodAnalysis = data.data.foodAnalysis;
      foodAnalysis.image = result.assets[0].uri;
      setAnalysis(foodAnalysis);
      router.push("/result");
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text className="text-3xl font-bold mb-4 text-black">
          👋 Hey, I'm Evie
        </Text>

        {/* Evie’s messages */}
        <EvieMessage>
          I'm your AI nutrition assistant. Just send me a photo of your food and
          I’ll break it down for you.
        </EvieMessage>

        <EvieMessage>
          Want to take a picture right now, or choose one from your gallery?
          📷🖼️
        </EvieMessage>

        {/* Typing animation while processing */}
        {isLoading && (
          <>
            <EvieMessage>Analyzing your image… hang tight!</EvieMessage>
            <EvieTyping />
          </>
        )}

        {/* Action Buttons */}
        {!isLoading && (
          <View className="mt-6 flex-col gap-4">
            <TouchableOpacity
              onPress={() => captureImage(true)}
              className="flex-row items-center gap-2 bg-blue-600 px-4 py-3 rounded-full shadow-md"
            >
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text className="text-white font-medium text-base">
                Take Photo
              </Text>
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
