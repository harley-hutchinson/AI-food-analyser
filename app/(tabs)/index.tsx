import { View, ScrollView, RefreshControl, Alert } from "react-native";
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
import { apiKeyStatusAtom } from "@/atoms/apiKey";

const fakeResponse = require("@/assets/response.json");

export default function Index() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);
  const setApiKeyStatus = useSetAtom(apiKeyStatusAtom);

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
    // if (__DEV__) {
    //   setAnalysis(fakeResponse);
    //   setHasAnalyzed(true);
    //   router.push("/result");
    //   return;
    // }

    setIsLoading(true);

    try {
      let result;

      if (camera) {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        setApiKeyStatus("missing");
        setIsLoading(false);
        Alert.alert(
          "Missing API Key",
          "Please add your Gemini API key in Settings before scanning."
        );
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
            apiKey,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error?.includes("Invalid API key")) {
            setApiKeyStatus("invalid");
            Alert.alert(
              "Invalid API Key",
              "Your API key is invalid. Please update it in Settings."
            );
          } else {
            Alert.alert(
              "Error",
              data.error || "Failed to analyze image. Please try again."
            );
          }
          setIsLoading(false);
          return;
        }

        const foodAnalysis = data.data.foodAnalysis;
        foodAnalysis.image = result.assets[0].uri;

        setAnalysis(foodAnalysis);
        setHasAnalyzed(true);
        setApiKeyStatus("connected");
        router.push("/result");
      }, 1000);
    } catch (error: any) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Something went wrong while analyzing your image.");
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
        <Header />
        <ChatMessages step={step} hasApiKey={hasApiKey} isLoading={isLoading} />
        {!isLoading && (step >= 3 || step === 99) && hasApiKey && (
          <ActionButtons captureImage={captureImage} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
