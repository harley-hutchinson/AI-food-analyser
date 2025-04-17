import { GoogleGenerativeAI } from "@google/generative-ai";
import { ai_prompt_v1 } from "@/lib/static/AIPrompt";

export async function POST(req: Request): Promise<Response> {
  try {
    const { image, apiKey } = await req.json();

    if (!apiKey) {
      return Response.json({ error: "Missing API key." }, { status: 400 });
    }

    const genAi = new GoogleGenerativeAI(apiKey);

    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = ai_prompt_v1;

    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    const text = response.text();

    // Remove any markdown formatting like ```json
    const cleanedText = text.replace(/```json\n?|```/g, "").trim();

    // Parse response safely
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (error) {
      console.log("Failed to parse Gemini response:", error);
      throw new Error("Invalid response format from Gemini.");
    }

    return Response.json({
      success: true,
      data: parsedResponse,
    });
  } catch (error: any) {
    console.error("Analyze API Error:", error);

    if (
      error.message?.toLowerCase().includes("api_key_invalid") ||
      error.message?.toLowerCase().includes("api key not valid") ||
      error.message?.toLowerCase().includes("unauthorized")
    ) {
      return Response.json(
        { error: "Invalid API key. Please update your key in Settings." },
        { status: 401 }
      );
    }

    return Response.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
