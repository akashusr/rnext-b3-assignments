import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// Import your existing AI model handlers
import { getGeminiResponse } from "@/lib/gemini";

export async function POST(request) {
  try {
    // Get auth token using your existing auth utility
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Verify token using your existing auth utility
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to database using your existing connection function
    await connectToDatabase();

    // Verify user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Parse request body
    const {
      model,
      message,
      systemPrompt = "",
      temperature = 0.7,
      maxTokens = 1000,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0,
    } = await request.json();

    // Validate required fields
    if (!model || !message) {
      return NextResponse.json(
        { error: "Model and message are required" },
        { status: 400 },
      );
    }

    // Validate parameters
    if (temperature < 0 || temperature > 2) {
      return NextResponse.json(
        { error: "Temperature must be between 0 and 2" },
        { status: 400 },
      );
    }

    if (maxTokens < 1 || maxTokens > 4000) {
      return NextResponse.json(
        { error: "Max tokens must be between 1 and 4000" },
        { status: 400 },
      );
    }

    if (topP < 0 || topP > 1) {
      return NextResponse.json(
        { error: "Top P must be between 0 and 1" },
        { status: 400 },
      );
    }

    // Prepare the conversation context
    const conversationContext = [];

    conversationContext.push({
      role: "user",
      content: message,
    });

    let response;
    let tokenCount = 0;

    // Route to appropriate AI model
    if (model.includes("gemini")) {
      try {
        response = await getGeminiResponse(
          conversationContext,
          model,
          systemPrompt,
        );

        // Estimate token count for Gemini (rough approximation)
        tokenCount = Math.ceil(response.length / 4);
      } catch (error) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
          { error: `Gemini API error: ${error.message}` },
          { status: 500 },
        );
      }
    } else if (model.includes("gpt")) {
      // OpenAI GPT models - these support system role
      const gptContext = [];

      if (systemPrompt) {
        gptContext.push({
          role: "system",
          content: systemPrompt,
        });
      }

      gptContext.push({
        role: "user",
        content: message,
      });

      try {
        const openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model,
              messages: gptContext,
              temperature,
              max_tokens: maxTokens,
              top_p: topP,
              frequency_penalty: frequencyPenalty,
              presence_penalty: presencePenalty,
            }),
          },
        );

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();
          throw new Error(
            errorData.error?.message || "OpenAI API request failed",
          );
        }

        const data = await openaiResponse.json();
        response = data.choices[0].message.content;
        tokenCount = data.usage?.total_tokens || 0;
      } catch (error) {
        console.error("OpenAI API error:", error);
        return NextResponse.json(
          { error: `OpenAI API error: ${error.message}` },
          { status: 500 },
        );
      }
    } else if (model.includes("claude")) {
      // Anthropic Claude models
      const claudeContext = [
        {
          role: "user",
          content: message,
        },
      ];

      try {
        const anthropicResponse = await fetch(
          "https://api.anthropic.com/v1/messages",
          {
            method: "POST",
            headers: {
              "x-api-key": process.env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model,
              messages: claudeContext,
              system: systemPrompt,
              max_tokens: maxTokens,
              temperature,
              top_p: topP,
            }),
          },
        );

        if (!anthropicResponse.ok) {
          const errorData = await anthropicResponse.json();
          throw new Error(
            errorData.error?.message || "Anthropic API request failed",
          );
        }

        const data = await anthropicResponse.json();
        response = data.content[0].text;
        tokenCount = data.usage?.output_tokens || 0;
      } catch (error) {
        console.error("Anthropic API error:", error);
        return NextResponse.json(
          { error: `Anthropic API error: ${error.message}` },
          { status: 500 },
        );
      }
    } else {
      // Fallback to Gemini for unknown models
      try {
        response = await getGeminiResponse(
          conversationContext,
          model,
          systemPrompt,
        );
        tokenCount = Math.ceil(response.length / 4);
      } catch (error) {
        console.error("Fallback Gemini API error:", error);
        return NextResponse.json(
          { error: `Model not supported: ${model}` },
          { status: 400 },
        );
      }
    }

    // Return successful response
    return NextResponse.json({
      response,
      tokenCount,
      model,
      parameters: {
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Playground API error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
