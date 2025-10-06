"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Message, LoadingSkeleton } from "@/components/Message";
import { ConversationInput } from "@/components/ConversationInput";
import { ExportButton } from "@/components/ExportButton";
import { PERSONAS } from "@/lib/personas";
import { useSpeech } from "@/hooks/useSpeech";
import { useMagicCommands } from "@/hooks/useMagicCommands";
import { useStreaming } from "@/hooks/useStreaming";
import { useImageUpload } from "@/hooks/useImageUpload";
import { isMagicCommand } from "@/lib/magicCommands";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id;
  const router = useRouter();
  const bottomRef = useRef(null);

  // Core state
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [showPersonaSettings, setShowPersonaSettings] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [customPrompt, setCustomPrompt] = useState("");

  // Custom hooks
  const { isListening, speechError, startListening, stopListening } =
    useSpeech();
  const {
    isStreaming,
    setIsStreaming,
    handleStreamingResponse,
    handleMessageRegenerate,
  } = useStreaming(conversationId);
  const {
    selectedImage,
    imagePreview,
    isUploadingImage,
    handleUploadImage,
    removeImage,
    setSelectedImage,
    setImagePreview,
  } = useImageUpload();
  const {
    showCommandSuggestions,
    commandSuggestions,
    handleInputChange: handleMagicInputChange,
    selectCommandSuggestion,
    executeMagicCommandWithStreaming,
  } = useMagicCommands(messages, conversationId, selectedModel);

  useEffect(() => {
    if (!conversationId) return;
    fetch(`/api/conversation/${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.conversation) {
          setNotFound(true);
          setConversation(null);
          setMessages([]);
        } else {
          setConversation(data.conversation);
          setMessages(data.messages || []);
          setSelectedModel(data.conversation?.model || "");

          const systemPrompt = data.conversation?.systemPrompt || "";
          const matchingPersona = PERSONAS.find(
            (p) => p.systemPrompt === systemPrompt,
          );
          if (matchingPersona) {
            setSelectedPersona(matchingPersona.id);
          } else if (systemPrompt) {
            setSelectedPersona("custom");
            setCustomPrompt(systemPrompt);
          } else {
            setSelectedPersona("default");
          }

          setNotFound(false);
        }
      });
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => setModels(data.models || []));
  }, [conversationId]);

  const getSystemPrompt = () => {
    if (selectedPersona === "custom") {
      return customPrompt;
    }
    const persona = PERSONAS.find((p) => p.id === selectedPersona);
    return persona?.systemPrompt || "";
  };

  const getCurrentPersona = () => {
    if (selectedPersona === "custom") {
      return {
        id: "custom",
        name: "Custom",
        emoji: "🎯",
        description: "Custom system prompt",
      };
    }
    return PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];
  };

  const handlePersonaChange = async (persona) => {
    setSelectedPersona(persona.id);
    if (persona.id === "custom") {
      setShowPersonaSettings(true);
    } else {
      const newSystemPrompt = persona.systemPrompt || "";
      try {
        setLoading(true);
        const response = await fetch(`/api/conversation/${conversationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ systemPrompt: newSystemPrompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to update persona");
        }

        const result = await response.json();
        setConversation((prev) => ({ ...prev, systemPrompt: newSystemPrompt }));
      } catch (error) {
        console.error("Failed to update persona:", error);
        setError("Failed to update persona. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCustomPromptSave = async () => {
    try {
      await fetch(`/api/conversation/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: customPrompt }),
      });
      setConversation((prev) => ({ ...prev, systemPrompt: customPrompt }));
      setShowPersonaSettings(false);
    } catch (error) {
      console.error("Failed to update custom prompt:", error);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleModelChange = async (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    await fetch(`/api/conversation/${conversationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: newModel }),
    });
    setConversation((prev) => ({ ...prev, model: newModel }));
  };

  // Event handlers
  const handleInputChange = (value) => {
    handleMagicInputChange(value, setInput);
  };

  const handleSubmit = async () => {
    if (!input.trim() && !imagePreview) return;

    if (isMagicCommand(input)) {
      await executeMagicCommandWithStreaming({
        commandInput: input,
        setMessages,
        setInput,
        setLoading,
        setIsStreaming,
        setError,
      });
    } else {
      await handleStreamingResponse({
        messageText: input,
        imagePreview,
        imageData: selectedImage?.base64Data,
        setMessages,
        setInput,
        setLoading,
        setError,
        setSelectedImage,
        setImagePreview,
        selectedImage,
      });
    }
  };

  const handleMessageRegeneration = () => {
    handleMessageRegenerate({
      messages,
      setMessages,
      setLoading,
      setError,
    });
  };

  const handleMessageEdit = async (messageId, newContent) => {
    await handleStreamingResponse({
      messageText: newContent,
      imagePreview: null,
      imageData: null,
      setMessages,
      setInput: () => {},
      setLoading,
      setError,
      setSelectedImage,
      setImagePreview,
      selectedImage: null,
    });
  };

  const handleVoiceInput = (transcript, autoSend = false) => {
    setInput(transcript);
    if (autoSend && transcript.trim()) {
      setTimeout(() => {
        handleSubmit();
      }, 100);
    }
  };

  const handleSelectCommandSuggestion = (suggestion) => {
    selectCommandSuggestion(suggestion, setInput);
  };

  if (notFound) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Conversation not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This conversation may have been deleted or never existed.
          </p>
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen mx-auto bg-white dark:bg-gray-900 max-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <header className="px-8 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white truncate max-w-xs">
                {conversation?.title || "Conversation"}
              </h1>
            </div>
            {conversation && (
              <div className="flex items-center space-x-2">
                <ExportButton
                  conversationId={conversationId}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                />
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-6">
          {messages.map((msg, index) => {
            const isLastAIMessage =
              msg.role === "assistant" && index === messages.length - 1;
            const hasPreviousUserMessage =
              index > 0 && messages[index - 1].role === "user";

            return (
              <Message
                key={msg._id}
                isAI={msg.role === "assistant"}
                content={msg.content}
                imageUrl={
                  msg.imageUrl &&
                  (msg.imageUrl.startsWith("/") ||
                    msg.imageUrl.startsWith("http"))
                    ? msg.imageUrl
                    : null
                }
                imageData={
                  msg.imageData ||
                  (msg.imageUrl && msg.imageUrl.startsWith("data:")
                    ? msg.imageUrl
                    : null)
                }
                isStreaming={msg.isStreaming}
                time={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                messageId={msg._id}
                onRegenerate={handleMessageRegeneration}
                onEdit={handleMessageEdit}
                isLastUserMessage={isLastAIMessage && hasPreviousUserMessage}
              />
            );
          })}
          {loading && !isStreaming && <LoadingSkeleton />}
          <div ref={bottomRef} />
        </div>

        <ConversationInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onVoiceInput={handleVoiceInput}
          onImageUpload={(e) => handleUploadImage(e, setError)}
          imagePreview={imagePreview}
          onRemoveImage={removeImage}
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
          customPrompt={customPrompt}
          onCustomPromptChange={setCustomPrompt}
          models={models}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          loading={loading}
          isUploadingImage={isUploadingImage}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          showCommandSuggestions={showCommandSuggestions}
          commandSuggestions={commandSuggestions}
          onSelectCommandSuggestion={handleSelectCommandSuggestion}
          speechError={speechError}
          error={error}
          currentPersona={getCurrentPersona()}
          showPersonaSettings={showPersonaSettings}
          onShowPersonaSettings={() => setShowPersonaSettings(true)}
          onHidePersonaSettings={() => setShowPersonaSettings(false)}
          onCustomPromptSave={handleCustomPromptSave}
        />
      </main>
    </div>
  );
}
