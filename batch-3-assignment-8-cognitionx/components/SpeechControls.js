import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export const VoiceInputButton = ({
  isListening,
  onStartListening,
  onStopListening,
  disabled,
}) => {
  return (
    <button
      onClick={isListening ? onStopListening : onStartListening}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        isListening
          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};

export const TextToSpeechButton = ({
  isSpeaking,
  onSpeak,
  onStopSpeaking,
  text,
  disabled,
}) => {
  const handleClick = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      onSpeak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !text?.trim()}
      className={`p-2 rounded-lg transition-colors ${
        isSpeaking
          ? "bg-blue-500 hover:bg-blue-600 text-white animate-pulse"
          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
};
