import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const messages = await Message.find({ conversationId: id }).sort({
      createdAt: 1,
    });

    return NextResponse.json({ conversation, messages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const updates = await req.json();

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Update the conversation with the provided fields
    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      {
        ...updates,
        updatedAt: new Date(),
      },
      { new: true },
    );

    return NextResponse.json({
      conversation: updatedConversation,
      message: "Conversation updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Delete all messages associated with this conversation
    await Message.deleteMany({ conversationId: id });

    // Delete the conversation
    await Conversation.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 },
    );
  }
}
