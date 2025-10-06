import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { formatConversationForExport } from "@/lib/exportUtils";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    console.log("Export request:", { id, format });

    // Fetch conversation
    const conversation = await Conversation.findById(id).lean();
    if (!conversation) {
      console.log("Conversation not found:", id);
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    console.log("Conversation found:", conversation.title);

    // Fetch messages for this conversation
    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean();

    console.log("Messages found:", messages.length);

    // Clean up the data to remove any problematic properties
    const cleanConversation = {
      _id: conversation._id,
      title: conversation.title || "Untitled Conversation",
      model: conversation.model || "Unknown Model",
      systemPrompt: conversation.systemPrompt || "",
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };

    const cleanMessages = messages.map((msg) => ({
      _id: msg._id,
      role: msg.role,
      content: msg.content || "",
      imageUrl: msg.imageUrl || null,
      createdAt: msg.createdAt,
    }));

    console.log("Data cleaned, formatting for export...");

    // Format the data for export
    const exportData = formatConversationForExport(
      cleanConversation,
      cleanMessages,
      format,
    );

    console.log("Export data formatted successfully");

    // Return the formatted content
    return new NextResponse(exportData.content, {
      status: 200,
      headers: {
        "Content-Type": exportData.mimeType,
        "Content-Disposition": `attachment; filename="${exportData.filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error details:", {
      message: error.message,
      stack: error.stack,
      params,
      url: request.url,
    });
    return NextResponse.json(
      { error: `Failed to export conversation: ${error.message}` },
      { status: 500 },
    );
  }
}
