import React from "react";
import { Clock, Type, Hash, FileText } from "lucide-react";

export function MetricsDisplay({ metrics }) {
  const formatTime = (milliseconds) => {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    return `${(milliseconds / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (responseTime) => {
    if (responseTime < 500) return "text-green-600 dark:text-green-400";
    if (responseTime < 2000) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const metricsData = [
    {
      icon: Clock,
      label: "Response Time",
      value: formatTime(metrics.responseTime),
      color: getPerformanceColor(metrics.responseTime),
      description: "Time taken to generate response",
    },
    {
      icon: Hash,
      label: "Tokens",
      value: metrics.tokenCount?.toLocaleString() || "N/A",
      color: "text-blue-600 dark:text-blue-400",
      description: "Estimated token count",
    },
    {
      icon: Type,
      label: "Characters",
      value: metrics.characterCount?.toLocaleString(),
      color: "text-purple-600 dark:text-purple-400",
      description: "Total character count",
    },
    {
      icon: FileText,
      label: "Words",
      value: metrics.wordCount?.toLocaleString(),
      color: "text-indigo-600 dark:text-indigo-400",
      description: "Approximate word count",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex justify-center mb-2">
              <IconComponent className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div className={`text-lg font-bold ${metric.color} mb-1`}>
              {metric.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {metric.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {metric.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
