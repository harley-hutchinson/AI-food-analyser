import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSetAtom } from "jotai";
import { analysisAtom } from "@/atoms/analysis";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const fakeResponse = require("@/assets/response.json");

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);
  const [isLoading, setIsLoading] = useState(false);

  const captureImage = async (camera = false) => {
    setIsLoading(true); // ⬅️ Start loading

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
        setIsLoading(false); // ⬅️ Stop loading if canceled
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 16,
          }}
        >
          Food Analyzer
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#666",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Upload a photo of your meal and we’ll analyse it for you.{"\n"}
          This will only take a few seconds!
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={{ width: "100%", gap: 16 }}>
            <TouchableOpacity
              onPress={() => captureImage(true)}
              style={{
                backgroundColor: "#007AFF",
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>📸 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => captureImage(false)}
              style={{
                backgroundColor: "#32CD32",
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>
                🖼️ Pick from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
