import React, { useState, useEffect } from "react";
import { FiSearch, FiMic, FiLayers } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";

const PromptInput = ({
  prompt,
  onChange,
  onGenerate,
  loading,
  modelsLoading,
  onTemplatesClick,
  onGeneratePromptsClick,
  allPrompts,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (prompt && prompt.trim().length > 2) {
      const lowerCasePrompt = prompt.toLowerCase();
      const matched =
        allPrompts
          ?.filter(
            (p) =>
              p.toLowerCase().includes(lowerCasePrompt) &&
              p.toLowerCase() !== lowerCasePrompt,
          )
          .slice(0, 5) || [];
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  }, [prompt, allPrompts]);

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setSuggestions([]);
  };

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      toast.error("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () =>
      toast.error("Voice recognition failed. Try again.");

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (transcript) onChange({ target: { value: transcript } });
    };

    recognition.start();
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="relative flex items-center rounded-xl border border-zinc-700/50 bg-zinc-900/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <FiSearch className="absolute left-4 text-zinc-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Enter your creative prompt..."
            value={prompt}
            onChange={onChange}
            onKeyDown={(e) => e.key === "Enter" && !loading && onGenerate()}
            className="w-full py-4 pl-12 pr-16 text-base text-white placeholder-zinc-400 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl"
          />
          <button
            onClick={onGenerate}
            disabled={modelsLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white transform rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-zinc-800 border border-zinc-700 rounded-lg mt-1 shadow-lg animate-fade-in-down">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-3 text-zinc-300 hover:bg-purple-700/60 cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={onTemplatesClick}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-300 bg-purple-800/20 hover:bg-purple-800/40 rounded-md transition"
        >
          <FiLayers className="w-4 h-4" /> Templates
        </button>
        <button
          onClick={onGeneratePromptsClick}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-300 bg-purple-800/20 hover:bg-purple-800/40 rounded-md transition"
        >
          <HiSparkles className="w-4 h-4" /> Generate Prompts
        </button>
        <button
          onClick={handleVoiceInput}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm text-purple-300 ${
            isRecording
              ? "bg-red-500/80"
              : "bg-purple-800/20 hover:bg-purple-800/40"
          } rounded-md transition`}
        >
          <FiMic className="w-4 h-4" />{" "}
          {isRecording ? "Listening..." : "Voice Prompt"}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
