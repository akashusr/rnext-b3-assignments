import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { getGeminiResponse } from "@/lib/gemini";

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { prompt, models } = await request.json();

    if (!prompt || !models || models.length < 2) {
      return NextResponse.json(
        { error: "Prompt and at least 2 models are required" },
        { status: 400 },
      );
    }

    if (models.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 models can be compared at once" },
        { status: 400 },
      );
    }

    // Send prompt to all models in parallel
    const comparisonPromises = models.map(async (modelName) => {
      const startTime = Date.now();

      try {
        let response;

        // Format prompt as messages array for getGeminiResponse
        const messagesArray = [
          {
            role: "user",
            content: prompt,
          },
        ];

        // For now, we'll use Gemini for all models as a demo
        // In a real implementation, you'd route to different AI providers
        switch (modelName) {
          case "gemini-1.5-pro-002":
          case "gemini-1.5-flash-002":
          case "gemini-1.0-pro":
            response = await getGeminiResponse(messagesArray, modelName);
            break;
          default:
            // For demo purposes, simulate other models with Gemini
            // but add model-specific context to differentiate responses
            const modelContext = getModelContext(modelName);
            const contextualMessages = [
              {
                role: "user",
                content: `${modelContext}\n\nUser prompt: ${prompt}`,
              },
            ];
            response = await getGeminiResponse(
              contextualMessages,
              "gemini-1.5-pro-002",
            );
        }

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        return {
          model: modelName,
          response: response,
          responseTime: responseTime,
          success: true,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        return {
          model: modelName,
          response: `Error: Failed to get response from ${modelName}. ${error.message}`,
          responseTime: responseTime,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    });

    // Wait for all models to respond
    const comparisons = await Promise.all(comparisonPromises);

    // Log the comparison for analytics
    console.log(
      `Comparison completed: ${models.join(" vs ")} - Prompt: "${prompt.substring(0, 50)}..."`,
    );

    return NextResponse.json({
      success: true,
      comparisons: comparisons,
      prompt: prompt,
      modelsCompared: models.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Failed to perform comparison" },
      { status: 500 },
    );
  }
}

// Helper function to add model-specific context for demo purposes
function getModelContext(modelName) {
  const contexts = {
    "gpt-4":
      "You are GPT-4, known for detailed analytical responses and step-by-step reasoning. Provide a comprehensive and well-structured answer.",
    "gpt-3.5-turbo":
      "You are GPT-3.5 Turbo, known for quick and efficient responses. Provide a concise but helpful answer.",
    "claude-3-opus":
      "You are Claude 3 Opus, known for thoughtful and nuanced responses with careful consideration of different perspectives.",
    "claude-3-sonnet":
      "You are Claude 3 Sonnet, balancing efficiency with quality. Provide a well-reasoned response with good detail.",
    "claude-3-haiku":
      "You are Claude 3 Haiku, known for quick and creative responses. Be concise but insightful.",
    "llama-2-70b":
      "You are Llama 2 70B, an open-source model known for helpful and harmless responses. Focus on being practical and useful.",
    "mistral-large":
      "You are Mistral Large, known for technical expertise and precise responses. Be accurate and detailed.",
    "palm-2":
      "You are PaLM 2, Google's language model known for factual accuracy and reasoning capabilities.",
  };

  return (
    contexts[modelName] ||
    "You are an AI assistant. Provide a helpful and accurate response."
  );
}

// GET endpoint to fetch comparison history
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // For now, return empty array
    // In a real implementation, you'd fetch from database
    return NextResponse.json({
      comparisons: [],
      total: 0,
    });
  } catch (error) {
    console.error("Failed to fetch comparisons:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison history" },
      { status: 500 },
    );
  }
}
