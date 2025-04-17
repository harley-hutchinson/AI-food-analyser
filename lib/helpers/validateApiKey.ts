import { GoogleGenerativeAI } from "@google/generative-ai";

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === "") {
    return false; // Empty key immediately invalid
  }

  try {
    const genAi = new GoogleGenerativeAI(apiKey);
    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Try a very small test call
    await model.generateContent(["Say hello!"]);

    return true; // Success
  } catch (error: any) {
    console.log("API Key validation error:", error?.message);
    return false;
  }
}
