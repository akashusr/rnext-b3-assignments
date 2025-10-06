import React from "react";
import { Info } from "lucide-react";

export function ParameterControls({ parameters, onParametersChange }) {
  const updateParameter = (key, value) => {
    onParametersChange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const parameterInfo = {
    temperature:
      "Controls randomness. Lower values = more focused, higher values = more creative",
    maxTokens: "Maximum number of tokens to generate in the response",
    topP: "Controls diversity via nucleus sampling. Lower values = more focused",
    frequencyPenalty:
      "Reduces repetition. Higher values = less repetitive text",
    presencePenalty:
      "Encourages new topics. Higher values = more diverse content",
  };

  const ParameterSlider = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    info,
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          {label}
          <div className="group relative ml-1">
            <Info className="w-3 h-3 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              {info}
            </div>
          </div>
        </label>
        <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <ParameterSlider
        label="Temperature"
        value={parameters.temperature}
        min={0}
        max={2}
        step={0.1}
        onChange={(value) => updateParameter("temperature", value)}
        info={parameterInfo.temperature}
      />

      <ParameterSlider
        label="Max Tokens"
        value={parameters.maxTokens}
        min={1}
        max={4000}
        step={1}
        onChange={(value) => updateParameter("maxTokens", value)}
        info={parameterInfo.maxTokens}
      />

      <ParameterSlider
        label="Top P"
        value={parameters.topP}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => updateParameter("topP", value)}
        info={parameterInfo.topP}
      />

      <ParameterSlider
        label="Frequency Penalty"
        value={parameters.frequencyPenalty}
        min={0}
        max={2}
        step={0.1}
        onChange={(value) => updateParameter("frequencyPenalty", value)}
        info={parameterInfo.frequencyPenalty}
      />

      <ParameterSlider
        label="Presence Penalty"
        value={parameters.presencePenalty}
        min={0}
        max={2}
        step={0.1}
        onChange={(value) => updateParameter("presencePenalty", value)}
        info={parameterInfo.presencePenalty}
      />

      {/* Reset to defaults button */}
      <button
        onClick={() =>
          onParametersChange({
            temperature: 0.7,
            maxTokens: 1000,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
            systemPrompt: parameters.systemPrompt,
          })
        }
        className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
