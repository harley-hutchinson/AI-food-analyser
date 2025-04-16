import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSetAtom } from "jotai";
import { analysisAtom } from "@/atoms/analysis";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

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

    let result;

    try {
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

      if (!result.canceled) {
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
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-4xl font-bold mb-4 text-black">
          Food Analyzer
        </Text>

        <Text className="text-[16px] text-gray-500 text-center">
          Upload a photo of your meal and we’ll analyse it for you.{"\n"}
        </Text>

        <Text className="text-[16px] text-gray-500 text-center mb-10">
          This will only take a few seconds!
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View className="w-full gap-4">
            <TouchableOpacity
              onPress={() => captureImage(true)}
              className="bg-blue-500 p-4 rounded-xl items-center"
            >
              <Text className="text-white text-lg">📸 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => captureImage(false)}
              className="bg-green-500 p-4 rounded-xl items-center"
            >
              <Text className="text-white text-lg">🖼️ Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
