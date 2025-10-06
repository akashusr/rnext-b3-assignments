import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

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

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30"; // days
    const userId = decoded.userId;

    await connectToDatabase();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    const conversations = await Conversation.find({
      userId,
      createdAt: { $gte: startDate },
    });

    const conversationIds = conversations.map((conv) => conv._id);

    const messages = await Message.find({
      conversationId: { $in: conversationIds },
      createdAt: { $gte: startDate },
    });

    const analytics = {
      overview: {
        totalConversations: conversations.length,
        totalMessages: messages.length,
        averageMessagesPerConversation:
          conversations.length > 0
            ? Math.round(messages.length / conversations.length)
            : 0,
        totalCharacters: messages.reduce(
          (sum, msg) => sum + (msg.content?.length || 0),
          0,
        ),
      },

      dailyActivity: getDailyActivity(
        conversations,
        messages,
        parseInt(timeRange),
      ),

      modelUsage: getModelUsage(conversations),

      personaUsage: getPersonaUsage(conversations),

      messageTypes: getMessageTypes(messages),

      peakTimes: getPeakTimes(messages),

      averageResponseLength: getAverageResponseLength(messages),

      magicCommandsUsage: getMagicCommandsUsage(messages),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}

function getDailyActivity(conversations, messages, days) {
  const dailyData = {};

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dailyData[dateStr] = {
      conversations: 0,
      messages: 0,
      date: dateStr,
    };
  }

  conversations.forEach((conv) => {
    const dateStr = conv.createdAt.toISOString().split("T")[0];
    if (dailyData[dateStr]) {
      dailyData[dateStr].conversations++;
    }
  });

  messages.forEach((msg) => {
    const dateStr = msg.createdAt.toISOString().split("T")[0];
    if (dailyData[dateStr]) {
      dailyData[dateStr].messages++;
    }
  });

  return Object.values(dailyData).reverse();
}

function getModelUsage(conversations) {
  const modelCounts = {};
  conversations.forEach((conv) => {
    const model = conv.model || "Unknown";
    modelCounts[model] = (modelCounts[model] || 0) + 1;
  });

  return Object.entries(modelCounts)
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count);
}

function getPersonaUsage(conversations) {
  const personaCounts = {};
  conversations.forEach((conv) => {
    const systemPrompt = conv.systemPrompt || "";
    let persona = "Default";

    if (systemPrompt.includes("code reviewer")) persona = "Code Reviewer";
    else if (systemPrompt.includes("marketing")) persona = "Marketing Guru";
    else if (systemPrompt.includes("creative writer"))
      persona = "Creative Writer";
    else if (systemPrompt.includes("research analyst"))
      persona = "Research Analyst";
    else if (systemPrompt.includes("sarcastic")) persona = "Sarcastic Robot";
    else if (systemPrompt.includes("teaching")) persona = "Teaching Assistant";
    else if (systemPrompt && systemPrompt.length > 0) persona = "Custom";

    personaCounts[persona] = (personaCounts[persona] || 0) + 1;
  });

  return Object.entries(personaCounts)
    .map(([persona, count]) => ({ persona, count }))
    .sort((a, b) => b.count - a.count);
}

function getMessageTypes(messages) {
  const userMessages = messages.filter((msg) => msg.role === "user").length;
  const assistantMessages = messages.filter(
    (msg) => msg.role === "assistant",
  ).length;

  return {
    user: userMessages,
    assistant: assistantMessages,
    total: messages.length,
  };
}

function getPeakTimes(messages) {
  const hourCounts = {};

  messages.forEach((msg) => {
    const hour = msg.createdAt.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  return Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);
}

function getAverageResponseLength(messages) {
  const assistantMessages = messages.filter((msg) => msg.role === "assistant");
  if (assistantMessages.length === 0) return 0;

  const totalLength = assistantMessages.reduce(
    (sum, msg) => sum + (msg.content?.length || 0),
    0,
  );
  return Math.round(totalLength / assistantMessages.length);
}

function getMagicCommandsUsage(messages) {
  const commandCounts = {};

  messages
    .filter((msg) => msg.role === "user")
    .forEach((msg) => {
      const content = msg.content || "";
      if (content.startsWith("/")) {
        const command = content.split(" ")[0];
        commandCounts[command] = (commandCounts[command] || 0) + 1;
      }
    });

  return Object.entries(commandCounts)
    .map(([command, count]) => ({ command, count }))
    .sort((a, b) => b.count - a.count);
}
