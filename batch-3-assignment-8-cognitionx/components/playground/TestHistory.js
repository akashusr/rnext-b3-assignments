import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function TestHistory({ history, onLoadFromHistory, onClearHistory }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, success, error
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "success" && item.success) ||
      (filterStatus === "error" && !item.success);
    return matchesSearch && matchesStatus;
  });

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (success) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Test History ({history.length} tests)
          </h3>
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts or models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="all">All Tests</option>
            <option value="success">Successful</option>
            <option value="error">Failed</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {history.length === 0
                ? "No tests run yet"
                : "No tests match your filters"}
            </div>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.success)}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.model}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => onLoadFromHistory(item)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Load</span>
                </button>
              </div>

              {/* Prompt Preview */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prompt:
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded line-clamp-2">
                  {item.prompt}
                </div>
              </div>

              {/* Response/Error Preview */}
              {item.success ? (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Response:
                    </div>
                    {item.response.length > 200 && (
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {expandedItems.has(item.id) ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            <span>Show Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            <span>Show More</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div
                    className={`text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded whitespace-pre-wrap ${
                      expandedItems.has(item.id) ? "" : "line-clamp-3"
                    }`}
                  >
                    {item.response}
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                    Error:
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                    {item.error}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {item.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.metrics.responseTime}ms
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Response Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.metrics.wordCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Words
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.metrics.characterCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Characters
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.parameters.temperature}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Temperature
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
