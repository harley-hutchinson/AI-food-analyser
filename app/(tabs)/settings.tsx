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

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [storedKey, setStoredKey] = useState<string | null>(null);

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

    await saveApiKey(apiKey.trim());
    Alert.alert("Success", "API Key saved successfully.");
    loadStoredKey();
  };

  const handleDelete = async () => {
    await deleteApiKey();
    Alert.alert("Deleted", "API Key removed.");
    setApiKey("");
    setStoredKey(null);
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

        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 py-4 rounded-lg items-center mb-4"
        >
          <Text className="text-white font-semibold text-lg">Save API Key</Text>
        </TouchableOpacity>

        {storedKey && (
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 py-4 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">Remove API Key</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
