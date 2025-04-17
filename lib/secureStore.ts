import * as SecureStore from "expo-secure-store";

const KEY = "GEMINI_API_KEY";

export async function saveApiKey(apiKey: string) {
  await SecureStore.setItemAsync(KEY, apiKey);
}

export async function getApiKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEY);
}

export async function deleteApiKey() {
  await SecureStore.deleteItemAsync(KEY);
}
