import { useState } from "react";
import {
  isMagicCommand,
  parseMagicCommand,
  executeMagicCommand,
  getMagicCommandSuggestions,
} from "@/lib/magicCommands";

export const useMagicCommands = (messages, conversationId, selectedModel) => {
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);
  const [commandSuggestions, setCommandSuggestions] = useState([]);

  const handleInputChange = (value, setInput) => {
    setInput(value);

    if (isMagicCommand(value)) {
      const query = value.slice(1).toLowerCase();
      const suggestions = getMagicCommandSuggestions(query);
      setCommandSuggestions(suggestions);
      setShowCommandSuggestions(true);
    } else {
      setShowCommandSuggestions(false);
      setCommandSuggestions([]);
    }
  };

  const selectCommandSuggestion = (suggestion, setInput) => {
    setInput(suggestion.command);
    setShowCommandSuggestions(false);
    setCommandSuggestions([]);
  };

  const executeMagicCommandWithStreaming = async ({
    commandInput,
    setMessages,
    setInput,
    setLoading,
    setIsStreaming,
    setError,
  }) => {
    const { command, args, isValid } = parseMagicCommand(commandInput);

    if (!isValid) {
      setError(
        `Unknown command: ${command}. Type /help to see available commands.`,
      );
      return;
    }

    setLoading(true);
    setIsStreaming(true);
    setError("");

    const commandMsg = {
      _id: Date.now().toString(),
      role: "user",
      content: commandInput,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, commandMsg]);

    const placeholderAssistantMsg = {
      _id: `magic-streaming-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, placeholderAssistantMsg]);
    setInput("");
    setShowCommandSuggestions(false);

    try {
      const saveUserMessageResponse = await fetch(
        `/api/conversation/${conversationId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "user",
            content: commandInput,
          }),
        },
      );

      if (!saveUserMessageResponse.ok) {
        throw new Error("Failed to save command message");
      }

      const result = await executeMagicCommand(
        command,
        args,
        messages,
        conversationId,
        selectedModel,
      );

      if (result.success) {
        const fullContent = result.result;
        const words = fullContent.split(" ");
        let currentContent = "";

        for (let i = 0; i < words.length; i++) {
          currentContent += (i > 0 ? " " : "") + words[i];

          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === placeholderAssistantMsg._id
                ? { ...msg, content: currentContent }
                : msg,
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const saveAIMessageResponse = await fetch(
          `/api/conversation/${conversationId}/message`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "assistant",
              content: fullContent,
            }),
          },
        );

        if (!saveAIMessageResponse.ok) {
          console.error("Failed to save AI response message");
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === placeholderAssistantMsg._id
              ? { ...msg, isStreaming: false }
              : msg,
          ),
        );
      } else {
        setError(result.error);
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== placeholderAssistantMsg._id),
        );
      }
    } catch (error) {
      setError(`Command failed: ${error.message}`);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== placeholderAssistantMsg._id),
      );
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  return {
    showCommandSuggestions,
    commandSuggestions,
    handleInputChange,
    selectCommandSuggestion,
    executeMagicCommandWithStreaming,
  };
};
