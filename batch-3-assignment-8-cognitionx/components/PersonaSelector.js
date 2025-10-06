import { useState, useRef, useEffect } from "react";
import { PERSONAS } from "@/lib/personas";
import { ChevronDown, Sparkles } from "lucide-react";

export const PersonaSelector = ({
  selectedPersona,
  onPersonaChange,
  customPrompt,
  onCustomPromptChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);

  const handlePersonaSelect = (persona) => {
    onPersonaChange(persona);
    setIsOpen(false);
    if (persona.id === "custom") {
      setShowCustomInput(true);
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
      setShowCustomInput(false);
    }
  };

  const handleCustomPromptSave = () => {
    setShowCustomInput(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomPromptSave();
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPersonaData =
    PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="space-y-2">
      {/* Compact Persona Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          disabled={disabled}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
        >
          <span className="text-lg">{selectedPersonaData.emoji}</span>
          <span className="hidden sm:inline">{selectedPersonaData.name}</span>
          <span className="sm:hidden">AI</span>
          {selectedPersona !== "default" && (
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Compact Dropdown */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Choose AI Persona
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handlePersonaSelect(persona)}
                  className={`w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    selectedPersona === persona.id
                      ? "bg-purple-50 dark:bg-purple-900/30 border-r-2 border-purple-500"
                      : ""
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{persona.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center space-x-1">
                      <span className="truncate">{persona.name}</span>
                      {persona.id !== "default" && (
                        <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {persona.description}
                    </div>
                  </div>
                  {selectedPersona === persona.id && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compact Custom Input */}
      {showCustomInput && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
          <label className="block text-xs font-medium text-amber-800 dark:text-amber-300 mb-2">
            Custom Prompt
          </label>
          <textarea
            ref={textareaRef}
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Define AI behavior..."
            className="w-full p-2 text-xs border border-amber-300 dark:border-amber-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
            rows={2}
            disabled={disabled}
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={() => setShowCustomInput(false)}
              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomPromptSave}
              className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
