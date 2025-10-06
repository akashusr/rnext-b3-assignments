import React, { useState } from "react";
import { Save, Play, Trash2, Plus, Edit3, Clock } from "lucide-react";

export function PresetManager({
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  currentConfig,
}) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetDescription, setPresetDescription] = useState("");

  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    onSavePreset(presetName.trim(), presetDescription.trim());
    setPresetName("");
    setPresetDescription("");
    setShowSaveDialog(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header and Save Button */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Saved Presets ({presets.length})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Save and reuse your favorite model configurations
            </p>
          </div>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current</span>
          </button>
        </div>

        {/* Current Configuration Preview */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-white mb-2">
            Current Configuration:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Model:</span>
              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                {currentConfig.model}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Temperature:
              </span>
              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                {currentConfig.parameters.temperature}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Max Tokens:
              </span>
              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                {currentConfig.parameters.maxTokens}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Prompt Length:
              </span>
              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                {currentConfig.prompt.length} chars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Save Preset
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Name *
                </label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="e.g., Creative Writing, Code Review..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder="Describe when to use this preset..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className="space-y-4">
        {presets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              No saved presets yet
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Save your current configuration to reuse it later
            </p>
          </div>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
                    {preset.name}
                  </h4>
                  {preset.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {preset.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Saved {formatTime(preset.timestamp)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onLoadPreset(preset)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Load</span>
                  </button>
                  <button
                    onClick={() => onDeletePreset(preset.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Preset Configuration Details */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {preset.model}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Model
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {preset.parameters.temperature}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Temperature
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {preset.parameters.maxTokens}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Max Tokens
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {preset.parameters.topP}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Top P
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {preset.prompt.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Prompt Chars
                  </div>
                </div>
              </div>

              {/* Prompt Preview */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prompt Preview:
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg line-clamp-3">
                  {preset.prompt || "No prompt saved"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
