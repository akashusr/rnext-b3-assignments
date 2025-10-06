import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ErrorMessage = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center py-10 text-center text-red-600 dark:text-red-400">
      <FiAlertTriangle className="h-8 w-8 mb-2" />
      <p className="mb-2 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded bg-red-100 px-4 py-1 text-sm font-medium text-red-600 hover:bg-red-200 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
