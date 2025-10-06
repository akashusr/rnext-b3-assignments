import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { getGeminiResponse } from "@/lib/gemini";
import { generateTitle } from "@/lib/titleGenerator";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  await connectToDatabase();

  // Check authentication
  const token = getTokenFromRequest(req);
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { title, message, model, systemPrompt, imageUrl, magicCommandResult } =
    await req.json();

  if (!title || !message || !model) {
    return NextResponse.json(
      { error: "Title, message, and model are required." },
      { status: 400 },
    );
  }

  try {
    const conversation = await Conversation.create({
      title: "Generating title...",
      model,
      systemPrompt: systemPrompt || "",
      userId: user._id, // Associate conversation with user
    });

    const userMsg = await Message.create({
      conversationId: conversation._id,
      role: "user",
      content: message,
      imageUrl: imageUrl || undefined,
    });

    let assistantContent = "";

    // If this is a magic command result, use it directly
    if (magicCommandResult) {
      assistantContent = magicCommandResult;
    } else {
      // Otherwise, get response from Gemini
      const geminiMessages = [
        {
          role: "user",
          content: message,
          ...(imageUrl && { imageData: imageUrl }),
        },
      ];

      try {
        assistantContent = await getGeminiResponse(
          geminiMessages,
          model,
          systemPrompt,
        );
      } catch (e) {
        return NextResponse.json(
          { error: `Gemini API error: ${e.message}` },
          { status: 500 },
        );
      }
    }

    const assistantMsg = await Message.create({
      conversationId: conversation._id,
      role: "assistant",
      content: assistantContent,
    });

    try {
      const generatedTitle = await generateTitle(conversation._id);
      if (generatedTitle) {
        console.log(
          `Successfully generated title: "${generatedTitle}" for conversation ${conversation._id}`,
        );
        // Update the conversation title directly
        conversation.title = generatedTitle;
        await conversation.save();
      } else {
        console.warn(
          `Title generation returned null for conversation ${conversation._id}`,
        );
        conversation.title = message.slice(0, 40);
        await conversation.save();
      }
    } catch (error) {
      console.error(
        `Title generation failed for conversation ${conversation._id}:`,
        error,
      );
      conversation.title = message.slice(0, 40);
      await conversation.save();
    }

    return NextResponse.json({
      conversation,
      messages: [userMsg, assistantMsg],
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create conversation: ${error.message}` },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  await connectToDatabase();

  // Check authentication
  const token = getTokenFromRequest(req);
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Only return conversations for the authenticated user
  const conversations = await Conversation.find({ userId: user._id }).sort({
    updatedAt: -1,
  });
  return NextResponse.json(conversations);
}
