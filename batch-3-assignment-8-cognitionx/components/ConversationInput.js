import { useState, useRef } from "react";
import { X, ImageIcon, ArrowRight } from "lucide-react";
import { VoiceInputButton } from "@/components/SpeechControls";
import { PersonaSelector } from "@/components/PersonaSelector";

export const ConversationInput = ({
  input,
  setInput,
  onSubmit,
  onInputChange,
  onVoiceInput,
  onImageUpload,
  imagePreview,
  onRemoveImage,
  selectedPersona,
  onPersonaChange,
  customPrompt,
  onCustomPromptChange,
  models,
  selectedModel,
  onModelChange,
  loading,
  isUploadingImage,
  isListening,
  startListening,
  stopListening,
  showCommandSuggestions,
  commandSuggestions,
  onSelectCommandSuggestion,
  speechError,
  error,
}) => {
  const fileInputRef = useRef(null);

  return (
    <footer className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="relative">
        <input
          type="text"
          placeholder="Ask me Anything"
          className="w-full p-4 pr-64 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
          disabled={loading}
          maxLength={1000}
        />

        {/* Magic Commands Dropdown */}
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
                  onClick={() => onSelectCommandSuggestion(suggestion)}
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
                onClick={onRemoveImage}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white"
                title="Remove image"
              >
                <X size={10} />
              </button>
            </div>
          )}
          <PersonaSelector
            selectedPersona={selectedPersona}
            onPersonaChange={onPersonaChange}
            customPrompt={customPrompt}
            onCustomPromptChange={onCustomPromptChange}
            disabled={loading}
          />
          <VoiceInputButton
            isListening={isListening}
            onStartListening={() => startListening(onVoiceInput, true)}
            onStopListening={stopListening}
            disabled={loading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            disabled={loading || isUploadingImage}
            title="Upload image"
          >
            <ImageIcon size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageUpload}
            accept="image/*"
            className="hidden"
          />
          <select
            className="p-1 pr-6 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-800 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            value={selectedModel}
            onChange={onModelChange}
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

      <div className="flex items-center justify-end mt-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {input.length}/1000
          </span>
          <button
            className="bg-black dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={onSubmit}
            disabled={loading || (!input.trim() && !imagePreview)}
          >
            <span className="text-sm">{loading ? "Sending..." : "Send"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 dark:text-red-400 text-sm mt-2">
          {error}
        </div>
      )}
      {speechError && (
        <div className="text-red-500 dark:text-red-400 text-sm mt-2">
          {speechError}
        </div>
      )}
    </footer>
  );
};
