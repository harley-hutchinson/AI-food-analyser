import { View, ScrollView, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useSetAtom } from "jotai";
import { analysisAtom } from "@/atoms/analysis";
import { getApiKey } from "@/lib/secureStore";
import Header from "@/components/Home/Header";
import ChatMessages from "@/components/Home/ChatMessages";
import ActionButtons from "@/components/Home/ActionButtons";

const fakeResponse = require("@/assets/response.json");

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const isFirstVisit = useRef(true);

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

      const apiKey = await getApiKey();
      if (!apiKey) {
        setIsLoading(false);
        alert("Please add your Gemini API key first.");
        return;
      }

      setTimeout(async () => {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: {
              inlineData: {
                data: result.assets[0].base64,
                mimeType: "image/jpeg",
              },
            },
            apiKey,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const foodAnalysis = data.data.foodAnalysis;
        foodAnalysis.image = result.assets[0].uri;
        setAnalysis(foodAnalysis);
        setHasAnalyzed(true);
        router.push("/result");
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image");
      setIsLoading(false);
    }
  };

  const startIntro = () => {
    const delays = [1000, 2000, 2000];
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setStep(current);

      if (current >= delays.length) {
        clearInterval(interval);
        setStep(3);
      }
    }, delays[current]);

    return () => clearInterval(interval);
  };

  useFocusEffect(
    useCallback(() => {
      const checkApiKey = async () => {
        const apiKey = await getApiKey();
        setHasApiKey(!!apiKey);
      };

      checkApiKey();

      setIsLoading(false);
      if (hasAnalyzed) {
        setStep(99);
      } else {
        setStep(0);
        if (isFirstVisit.current) {
          startIntro();
        } else {
          setStep(3);
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
        <Header hasApiKey={hasApiKey} />
        <ChatMessages step={step} hasApiKey={hasApiKey} isLoading={isLoading} />
        {!isLoading && (step >= 3 || step === 99) && hasApiKey && (
          <ActionButtons captureImage={captureImage} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
