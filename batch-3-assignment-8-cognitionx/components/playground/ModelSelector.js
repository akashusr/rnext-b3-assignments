import React from "react";

export function ModelSelector({ models, selectedModel, onModelChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          AI Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.displayName || model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Info */}
      {selectedModel && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            Model Information
          </h4>
          <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <p>
              <span className="font-medium">Selected:</span> {selectedModel}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {selectedModel.includes("gpt")
                ? "OpenAI GPT"
                : selectedModel.includes("gemini")
                  ? "Google Gemini"
                  : selectedModel.includes("claude")
                    ? "Anthropic Claude"
                    : "Language Model"}
            </p>
            <p>
              <span className="font-medium">Capabilities:</span> Text
              generation, conversation, analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
