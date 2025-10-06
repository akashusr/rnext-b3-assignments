"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Sidebar } from "@/components/Sidebar";
import { Zap, ArrowRight, ImageIcon, X, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSpeech } from "@/hooks/useSpeech";
import { VoiceInputButton } from "@/components/SpeechControls";
import { PersonaSelector } from "@/components/PersonaSelector";
import { PERSONAS } from "@/lib/personas";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import {
  isMagicCommand,
  parseMagicCommand,
  executeMagicCommand,
  getMagicCommandSuggestions,
} from "@/lib/magicCommands";

const SUGGESTIONS = [
  "Generate a list of creative marketing ideas.",
  "/help - Show all available magic commands",
  "/brainstorm marketing ideas for a coffee shop",
];

const LoadingSkeleton = () => (
  <div className="flex items-center space-x-3 animate-pulse mt-8 w-full max-w-2xl">
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 flex-shrink-0" />
    <div className="flex-1">
      <div className="rounded-2xl px-4 py-3 max-w-2xl bg-gray-100 h-6 mb-2" />
      <div className="rounded-2xl px-4 py-3 max-w-xl bg-gray-100 h-4" />
    </div>
  </div>
);

export default function WelcomePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [customPrompt, setCustomPrompt] = useState("");
  const [, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);
  const [commandSuggestions, setCommandSuggestions] = useState([]);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const { isListening, speechError, startListening, stopListening } =
    useSpeech();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Handle RAG context from localStorage when returning from RAG page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('context') === 'rag') {
      const ragContext = localStorage.getItem('ragContext');
      if (ragContext) {
        setInput(ragContext);
        localStorage.removeItem('ragContext'); // Clean up
        // Update URL without context parameter
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch models: ${res.status} ${res.statusText}`,
          );
        }
        return res.json();
      })
      .then((data) => {
        setModels(data.models || []);
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0].name);
        }
      })
      .catch((error) => {
        setError("Failed to load models. Please refresh the page.");
      });
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showLogin ? (
      <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  const getSystemPrompt = () => {
    if (selectedPersona === "custom") {
      return customPrompt;
    }
    const persona = PERSONAS.find((p) => p.id === selectedPersona);
    return persona?.systemPrompt || "";
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      setImagePreview(data.base64Data);
      setSelectedImage({
        url: data.url,
        base64Data: data.base64Data,
      });
    } catch (e) {
      setError(`Image upload failed: ${e.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInputChange = (value) => {
    setInput(value);

    if (isMagicCommand(value)) {
      const query = value.slice(1).toLowerCase();
      const suggestions = getMagicCommandSuggestions(query);
      setCommandSuggestions(suggestions);
      setShowCommandSuggestions(suggestions.length > 0);
    } else {
      setShowCommandSuggestions(false);
      setCommandSuggestions([]);
    }
  };

  const handleMagicCommand = async (commandInput) => {
    const { command, args, isValid } = parseMagicCommand(commandInput);

    if (!isValid) {
      setError(
        `Unknown command: ${command}. Type /help to see available commands.`,
      );
      return;
    }

    // Handle /kb command to open Knowledge Base
    if (command === "/kb") {
      setShowKnowledgeBase(true);
      setInput("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await executeMagicCommand(
        command,
        args,
        [],
        null,
        selectedModel,
      );

      if (result.success) {
        const res = await fetch("/api/conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: commandInput.slice(0, 40),
            message: commandInput,
            model: selectedModel,
            systemPrompt: getSystemPrompt(),
            magicCommandResult: result.result,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to create conversation");
        }

        const data = await res.json();
        router.push(`/conversation/${data.conversation._id}`);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(`Command failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (prompt) => {
    if (!prompt && !imagePreview) return;
    if (!selectedModel) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt?.slice(0, 40) || "Image conversation",
          message: prompt || "Image attached",
          model: selectedModel,
          systemPrompt: getSystemPrompt(),
          imageUrl: imagePreview,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Failed to create conversation: ${res.status}`);
      }

      const data = await res.json();
      if (!data || !data.conversation || !data.conversation._id) {
        throw new Error("Invalid response from server");
      }

      router.push(`/conversation/${data.conversation._id}`);
    } catch (e) {
      setError(`Failed to start chat: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (inputText = null) => {
    const textToSend = inputText || input;
    if (!textToSend.trim() && !imagePreview) return;

    if (isMagicCommand(textToSend)) {
      await handleMagicCommand(textToSend);
    } else {
      await handleSend(textToSend);
    }
  };

  const handleInputFocus = () => {};

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVoiceClick = () => {
    startListening(handleVoiceInput, true);
  };

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
  };

  const selectCommandSuggestion = (suggestion) => {
    setInput(suggestion.command);
    setShowCommandSuggestions(false);
    setCommandSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Small delay to ensure the input is updated before submitting
    setTimeout(() => {
      handleSubmit(suggestion);
    }, 50);
  };

  return (
    <div className="flex h-screen mx-auto bg-white dark:bg-gray-900 max-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-8 overflow-y-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 mb-8 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 opacity-80" />
          </div>

          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white mb-2">
            Hi there
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            How can I help you today?
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8 leading-relaxed">
            Choose a persona to customize the AI&apos;s behavior, then start
            your conversation.
          </p>

          <div className="space-y-3 w-full max-w-2xl">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all text-left bg-white dark:bg-gray-800"
                onClick={() => handleSuggestionClick(s)}
                disabled={loading}
              >
                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{s}</span>
              </button>
            ))}
            {loading && <LoadingSkeleton />}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me Anything or try /help for magic commands"
              className="w-full p-4 pr-64 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              onFocus={handleInputFocus}
              disabled={loading}
              maxLength={1000}
            />
            {showCommandSuggestions && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {commandSuggestions.length === 0 ? (
                  <div className="p-2 text-gray-500 dark:text-gray-400 text-sm">
                    No command suggestions
                  </div>
                ) : (
                  commandSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.command}
                      className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      onClick={() => selectCommandSuggestion(suggestion)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{suggestion.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-white">
                            {suggestion.command}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {suggestion.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {imagePreview && (
                <div className="relative mr-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-8 w-8 rounded object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white"
                    title="Remove image"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
              <PersonaSelector
                selectedPersona={selectedPersona}
                onPersonaChange={(persona) => setSelectedPersona(persona.id)}
                customPrompt={customPrompt}
                onCustomPromptChange={setCustomPrompt}
                disabled={loading}
              />
              <button
                onClick={handleUploadClick}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading || isUploadingImage}
                title="Upload image"
              >
                <ImageIcon size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadImage}
                accept="image/*"
                className="hidden"
              />
              <VoiceInputButton
                isListening={isListening}
                onStartListening={handleVoiceClick}
                onStopListening={stopListening}
                disabled={loading}
              />
              <button
                onClick={() => router.push('/rag')}
                className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                disabled={loading}
                title="Knowledge Base"
              >
                <Database size={16} />
              </button>
              <select
                className="p-1 pr-6 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-700 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={models.length === 0}
                style={{ minWidth: "110px" }}
              >
                {models.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.displayName || m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-end justify-end mt-3">
            <div className="flex items-end space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {input.length}/1000
              </span>
              <button
                className="bg-black dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                onClick={() => handleSubmit()}
                disabled={loading || (!input.trim() && !imagePreview)}
              >
                <span className="text-sm">
                  {loading ? "Sending..." : "Send"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {speechError && (
            <div className="text-red-500 text-sm mt-2">{speechError}</div>
          )}
        </div>
      </main>
    </div>
  );
}
