import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { saveApiKey, getApiKey, deleteApiKey } from "@/lib/secureStore";
import { validateApiKey } from "@/lib/helpers/validateApiKey";
import { useSetAtom, useAtomValue } from "jotai";
import { apiKeyStatusAtom } from "@/atoms/apiKey";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [storedKey, setStoredKey] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiKeyStatus = useAtomValue(apiKeyStatusAtom);
  const setApiKeyStatus = useSetAtom(apiKeyStatusAtom);

  useEffect(() => {
    loadStoredKey();
  }, []);

  const loadStoredKey = async () => {
    const key = await getApiKey();
    setStoredKey(key);
    setApiKey(key || "");
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing API Key",
        text2: "Please enter a valid API Key.",
      });
      return;
    }

    setIsSaving(true);

    const isValid = await validateApiKey(apiKey.trim());

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Invalid API Key",
        text2: "Please check and try again.",
      });
      setApiKeyStatus("invalid");
      setIsSaving(false);
      return;
    }

    await saveApiKey(apiKey.trim());
    Toast.show({
      type: "success",
      text1: "API Key Saved!",
      text2: "You're ready to go 🎉",
    });
    setApiKeyStatus("connected");
    setIsSaving(false);
    loadStoredKey();
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteApiKey();
    Toast.show({
      type: "info",
      text1: "API Key Removed",
      text2: "You’ll need to add one to use Evie.",
    });
    setApiKey("");
    setStoredKey(null);
    setApiKeyStatus("missing");

    setIsDeleting(false);
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing API Key",
        text2: "Please enter an API Key first.",
      });
      return;
    }

    setIsTesting(true);

    const isValid = await validateApiKey(apiKey.trim());

    if (isValid) {
      Toast.show({
        type: "success",
        text1: "API Key is valid!",
        text2: "Connection confirmed ✅",
      });
      setApiKeyStatus("connected");
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid API Key",
        text2: "Please check and try again.",
      });
      setApiKeyStatus("invalid");
    }

    setIsTesting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold mb-6 text-black">⚙️ Settings</Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-2">
            Gemini API Key
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-black"
            placeholder="Enter your Gemini API Key..."
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Status display */}
        <View className="mb-6">
          <Text className="text-lg text-black font-medium mb-2">
            Connection Status:
          </Text>
          {apiKeyStatus === "connected" && (
            <Text className="text-green-600 font-semibold">✅ Connected</Text>
          )}
          {apiKeyStatus === "invalid" && (
            <Text className="text-red-500 font-semibold">❌ Invalid Key</Text>
          )}
          {apiKeyStatus === "missing" && (
            <Text className="text-gray-400 font-semibold">➖ No Key</Text>
          )}
        </View>

        {/* Buttons section */}
        <View className="bg-gray-100 p-4 rounded-xl gap-4">
          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="flex-row items-center justify-center bg-blue-600 py-4 rounded-lg gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text className="text-white font-semibold text-lg">
                  Save API Key
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Test and Delete if key exists */}
          {storedKey && (
            <View className="flex-row justify-between gap-4">
              <TouchableOpacity
                onPress={handleTestApiKey}
                className="flex-1 flex-row items-center justify-center bg-yellow-500 py-3 rounded-lg gap-2"
                disabled={isTesting}
              >
                {isTesting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#fff"
                    />
                    <Text className="text-white font-semibold text-base">
                      Test
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="flex-1 flex-row items-center justify-center bg-red-500 py-3 rounded-lg gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text className="text-white font-semibold text-base">
                      Remove
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
