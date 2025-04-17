import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { saveApiKey, getApiKey, deleteApiKey } from "@/lib/secureStore";
import { validateApiKey } from "@/lib/helpers/validateApiKey";
import { useSetAtom, useAtomValue } from "jotai";
import { apiKeyStatusAtom } from "@/atoms/apiKey";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [storedKey, setStoredKey] = useState<string | null>(null);

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
      Alert.alert("Error", "Please enter a valid API Key.");
      return;
    }

    const isValid = await validateApiKey(apiKey.trim());

    if (!isValid) {
      Alert.alert(
        "Invalid API Key",
        "The API key you entered is invalid. Please check and try again."
      );
      setApiKeyStatus("invalid");
      return;
    }

    await saveApiKey(apiKey.trim());
    Alert.alert("Success", "API Key saved successfully.");
    setApiKeyStatus("connected");
    loadStoredKey();
  };

  const handleDelete = async () => {
    await deleteApiKey();
    Alert.alert("Deleted", "API Key removed.");
    setApiKey("");
    setStoredKey(null);
    setApiKeyStatus("missing");
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Error", "Please enter an API key first.");
      return;
    }

    const isValid = await validateApiKey(apiKey.trim());

    if (isValid) {
      Alert.alert("Success", "API key is valid!");
      setApiKeyStatus("connected");
    } else {
      Alert.alert("Invalid", "The API key you entered is invalid.");
      setApiKeyStatus("invalid");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 py-4 rounded-lg items-center mb-4"
        >
          <Text className="text-white font-semibold text-lg">Save API Key</Text>
        </TouchableOpacity>

        {/* Extra buttons if key exists */}
        {storedKey && (
          <>
            <TouchableOpacity
              onPress={handleTestApiKey}
              className="bg-yellow-500 py-4 rounded-lg items-center mb-4"
            >
              <Text className="text-white font-semibold text-lg">
                Test API Key
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-500 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-lg">
                Remove API Key
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
