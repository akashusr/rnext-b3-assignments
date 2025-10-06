import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { getGeminiResponse } from "@/lib/gemini";

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractTopic(question) {
  return question.split(" ").slice(0, 3).join(" ");
}

export async function POST(req) {
  try {
    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .limit(2);

    if (messages.length < 2) {
      return NextResponse.json(
        { error: "Not enough messages to generate a title" },
        { status: 400 },
      );
    }

    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
      imageUrl: m.imageUrl || null,
    }));

    formattedMessages.push({
      role: "user",
      content:
        "Create a catchy, capitalized title for this conversation that's 2-5 words long. The title should be in title case (capitalize important words), be creative, and NOT just repeat the question. For example, if the conversation is about 'choreography in movies', the title could be 'Film Dance Artistry' or 'Cinematic Movement Masters'. Return ONLY the title text, no quotes or explanations.",
    });

    try {
      const title = await getGeminiResponse(
        formattedMessages,
        "gemini-1.5-flash",
      );

      let cleanTitle = title.trim();

      cleanTitle = cleanTitle.replace(/^["'\s.,;:]+|["'\s.,;:]+$/g, "");

      cleanTitle = toTitleCase(cleanTitle);

      const userQuestion = messages[0].content.toLowerCase();
      const titleLower = cleanTitle.toLowerCase();

      if (
        titleLower === userQuestion.toLowerCase() ||
        userQuestion.includes(titleLower) ||
        titleLower.includes(userQuestion)
      ) {
        const topic = extractTopic(userQuestion);
        cleanTitle = toTitleCase(topic + " Discussion");
      }

      if (cleanTitle.length > 50) {
        cleanTitle = cleanTitle.substring(0, 47) + "...";
      }

      if (
        !cleanTitle ||
        cleanTitle.includes("[No response") ||
        cleanTitle.length < 2
      ) {
        cleanTitle = "New Conversation";
      }

      conversation.title = cleanTitle;
      await conversation.save();

      return NextResponse.json({ success: true, title: cleanTitle });
    } catch (error) {
      console.error("Error generating title with Gemini:", error);
      return NextResponse.json(
        { error: "Failed to generate title" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in title generation endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 },
    );
  }
}
