export const MAGIC_COMMANDS = {
  "/summarize": {
    name: "Summarize",
    description: "Summarize the current conversation",
    icon: "📝",
    requiresConversation: true,
  },
  "/history": {
    name: "History",
    description: "Show conversation history overview",
    icon: "📚",
    requiresConversation: true,
  },
  "/explain": {
    name: "Explain",
    description: "Explain the last AI response in simple terms",
    icon: "💡",
    requiresConversation: true,
  },
  "/translate": {
    name: "Translate",
    description: "Translate the last message to English",
    icon: "🌍",
    requiresConversation: true,
  },
  "/code": {
    name: "Code Review",
    description: "Review any code in the conversation",
    icon: "💻",
    requiresConversation: true,
  },
  "/brainstorm": {
    name: "Brainstorm",
    description: "Generate creative ideas based on the conversation",
    icon: "🧠",
    requiresConversation: false,
  },
  "/help": {
    name: "Help",
    description: "Show available magic commands",
    icon: "❓",
    requiresConversation: false,
  },
  "/kb": {
    name: "Knowledge Base",
    description: "Open knowledge base management",
    icon: "🗄️",
    requiresConversation: false,
  },
  "/search": {
    name: "Search Knowledge",
    description: "Search your knowledge base (e.g., /search artificial intelligence)",
    icon: "🔍",
    requiresConversation: false,
  },
  "/ask": {
    name: "Ask with Context",
    description: "Ask a question using knowledge base context",
    icon: "🧠",
    requiresConversation: false,
  },
  "/docs": {
    name: "Document Stats",
    description: "Show knowledge base statistics",
    icon: "📊",
    requiresConversation: false,
  },
};

export function isMagicCommand(input) {
  return input.trim().startsWith("/");
}

export function parseMagicCommand(input) {
  const trimmed = input.trim();
  const parts = trimmed.split(" ");
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  return {
    command,
    args,
    isValid: MAGIC_COMMANDS.hasOwnProperty(command),
  };
}

// This function will now make an API call to the server to execute commands
export async function executeMagicCommand(
  command,
  args,
  messages = [],
  conversationId = null,
  model = "gemini-1.5-pro-002",
) {
  const commandInfo = MAGIC_COMMANDS[command];

  if (!commandInfo) {
    return {
      success: false,
      error: `Unknown command: ${command}. Type /help to see available commands.`,
    };
  }

  if (
    commandInfo.requiresConversation &&
    (!messages || messages.length === 0)
  ) {
    return {
      success: false,
      error: `The ${command} command requires an active conversation with messages.`,
    };
  }

  try {
    // Make API call to server to execute the command
    const response = await fetch("/api/magic-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command,
        args,
        messages,
        conversationId,
        model,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to execute command");
    }

    const result = await response.json();
    return {
      success: true,
      result: result.result,
      command,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute ${command}: ${error.message}`,
    };
  }
}

export function getMagicCommandSuggestions(input) {
  const query = input.toLowerCase();

  // If input is empty (just "/"), show all commands
  if (query === "") {
    return Object.entries(MAGIC_COMMANDS).map(([cmd, info]) => ({
      command: cmd,
      ...info,
    }));
  }

  // Otherwise filter by command name or description
  return Object.entries(MAGIC_COMMANDS)
    .filter(
      ([cmd, info]) =>
        cmd.includes(query) || info.description.toLowerCase().includes(query),
    )
    .map(([cmd, info]) => ({
      command: cmd,
      ...info,
    }));
}
