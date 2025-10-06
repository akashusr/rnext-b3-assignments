import React, { useState } from "react";
import { Eye, EyeOff, Lightbulb } from "lucide-react";

export function PromptEditor({
  prompt,
  onPromptChange,
  systemPrompt,
  onSystemPromptChange,
}) {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const promptExamples = [
    {
      title: "Creative Writing",
      prompt:
        "Write a short story about a time traveler who discovers that changing the past has unexpected consequences.",
      system:
        "You are a creative writing assistant. Focus on engaging storytelling with vivid descriptions and compelling characters.",
    },
    {
      title: "Code Review",
      prompt:
        "Review this JavaScript function and suggest improvements:\n\nfunction calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
      system:
        "You are a senior software engineer. Provide constructive code reviews focusing on performance, readability, and best practices.",
    },
    {
      title: "Data Analysis",
      prompt:
        "Analyze the following sales data and provide insights:\nQ1: $125,000\nQ2: $150,000\nQ3: $135,000\nQ4: $180,000\n\nWhat trends do you see and what recommendations would you make?",
      system:
        "You are a data analyst. Provide clear, actionable insights based on data analysis with specific recommendations.",
    },
    {
      title: "Educational",
      prompt:
        "Explain quantum computing in simple terms that a high school student could understand.",
      system:
        "You are an educational assistant. Explain complex topics in simple, engaging ways with relevant examples and analogies.",
    },
  ];

  const loadExample = (example) => {
    onPromptChange(example.prompt);
    onSystemPromptChange(example.system);
  };

  return (
    <div className="space-y-4">
      {/* System Prompt Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            System Prompt (Optional)
          </label>
          <button
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {showSystemPrompt ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showSystemPrompt ? "Hide" : "Show"}</span>
          </button>
        </div>

        {showSystemPrompt && (
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="Define the AI's role and behavior (e.g., 'You are a helpful assistant that explains complex topics simply...')"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={3}
          />
        )}
      </div>

      {/* Main Prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            User Prompt
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {prompt.length} characters
          </span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          rows={6}
        />
      </div>

      {/* Example Prompts */}
      <div>
        <div className="flex items-center mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Example Prompts
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {promptExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example)}
              className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
            >
              <div className="font-medium text-sm text-gray-800 dark:text-white mb-1">
                {example.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {example.prompt.slice(0, 80)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onPromptChange("")}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => {
            const selection = window.getSelection().toString();
            if (selection) {
              onPromptChange(selection);
            }
          }}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Use Selection
        </button>
      </div>
    </div>
  );
}
