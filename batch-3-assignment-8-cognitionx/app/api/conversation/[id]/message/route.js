import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function POST(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { role, content, imageUrl } = await request.json();
    const conversationId = params.id;

    if (!role || !content) {
      return NextResponse.json(
        { error: "Role and content are required" },
        { status: 400 },
      );
    }

    if (!["user", "assistant"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either 'user' or 'assistant'" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: decoded.userId,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404 },
      );
    }

    const message = new Message({
      conversationId,
      role,
      content,
      imageUrl,
      createdAt: new Date(),
    });

    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: {
        _id: message._id,
        conversationId: message.conversationId,
        role: message.role,
        content: message.content,
        imageUrl: message.imageUrl,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 },
    );
  }
}
