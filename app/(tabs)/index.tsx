import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSetAtom } from "jotai";
import { analysisAtom } from "@/atoms/analysis";
import { useEffect, useState, useCallback, useRef } from "react";
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
  const [step, setStep] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFirstVisit = useRef(true); // 🧠 Track if it's the user's first time

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoading(false);
    setHasAnalyzed(false);
    setStep(0);
    startIntro();
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const captureImage = async (camera = false) => {
    if (__DEV__) {
      setAnalysis(fakeResponse);
      setHasAnalyzed(true);
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

      setTimeout(async () => {
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
        setHasAnalyzed(true);
        router.push("/result");
      }, 2000);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  // ✨ Animate Evie's chat intro
  const startIntro = () => {
    const delays = [1000, 2000, 2000];
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setStep(current);

      if (current >= delays.length) {
        clearInterval(interval);
        setStep(3); // step 3 = show buttons
      }
    }, delays[current]);

    return () => clearInterval(interval);
  };

  // Start intro on first load
  useEffect(() => {
    if (!hasAnalyzed) {
      startIntro();
    }
  }, []);

  // Reset screen when focus changes (tab switching)
  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);

      if (hasAnalyzed) {
        setStep(99); // after analysis, show ready message
      } else {
        setStep(0);
        if (isFirstVisit.current) {
          startIntro(); // full intro first time
        } else {
          setStep(3); // quick skip intro after first
        }
        isFirstVisit.current = false;
      }
    }, [hasAnalyzed])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Heading */}
        <Text className="text-3xl font-bold mb-4 text-black">
          👋 Hey, I'm Evie
        </Text>

        {/* Initial chat */}
        {step === 0 && <EvieTyping />}

        {step >= 1 && step < 99 && (
          <EvieMessage>
            I'm your AI nutrition assistant. Just send me a photo of your food
            and I’ll break it down for you.
          </EvieMessage>
        )}

        {step >= 2 && step < 99 && (
          <EvieMessage>
            Want to take a picture right now, or choose one from your gallery?
            📷🖼️
          </EvieMessage>
        )}

        {/* Post analysis chat */}
        {step === 99 && (
          <>
            <EvieMessage>
              Want to scan another meal? I’m ready when you are 🍽️
            </EvieMessage>
          </>
        )}

        {/* Loading state */}
        {isLoading && (
          <>
            <EvieMessage>Analyzing your image… hang tight!</EvieMessage>
            <EvieTyping />
          </>
        )}

        {/* Action buttons */}
        {!isLoading && (step >= 3 || step === 99) && (
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
