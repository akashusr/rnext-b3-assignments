import React, { useState, useEffect } from "react";
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  Download,
  Save,
  Copy,
  BarChart3,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";

export function ModelComparisonInterface({
  comparisons,
  onSave,
  prompt,
  votes = {},
  onVoteChange,
}) {
  const [metrics, setMetrics] = useState({});
  const [savedComparison, setSavedComparison] = useState(false);

  useEffect(() => {
    // Calculate metrics for each response
    const calculatedMetrics = {};
    comparisons.forEach((comp) => {
      calculatedMetrics[comp.model] = {
        responseTime: comp.responseTime || Math.random() * 2000 + 500, // Mock if not provided
        wordCount: comp.response.split(" ").length,
        charCount: comp.response.length,
        sentences: comp.response
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 0).length,
      };
    });
    setMetrics(calculatedMetrics);
  }, [comparisons]);

  const copyResponse = async (response) => {
    try {
      await navigator.clipboard.writeText(response);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const saveComparison = async () => {
    const comparisonData = {
      prompt,
      responses: comparisons,
      votes,
      metrics,
      timestamp: new Date().toISOString(),
    };

    await onSave(comparisonData);
    setSavedComparison(true);
    setTimeout(() => setSavedComparison(false), 2000);
  };

  const exportComparison = () => {
    const exportData = {
      prompt,
      timestamp: new Date().toLocaleString(),
      responses: comparisons.map((comp) => ({
        model: comp.model,
        response: comp.response,
        metrics: metrics[comp.model],
        vote: votes[comp.model] || "none",
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBestMetric = (metricKey) => {
    const values = Object.values(metrics).map((m) => m[metricKey]);
    if (metricKey === "responseTime") {
      return Math.min(...values);
    }
    return Math.max(...values);
  };

  const handleVote = (model, voteType) => {
    // Use the parent's vote handler instead of local state
    onVoteChange(model, voteType);
  };

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Comparison Results
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              &ldquo;{prompt}&rdquo;
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={saveComparison}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                savedComparison
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{savedComparison ? "Saved!" : "Save"}</span>
            </button>
            <button
              onClick={exportComparison}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Models Compared
            </div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {comparisons.length}
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <Clock className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Response Time
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {Object.keys(metrics).length > 0
                ? Math.round(
                    Object.values(metrics).reduce(
                      (sum, m) => sum + m.responseTime,
                      0,
                    ) / Object.keys(metrics).length,
                  )
                : 0}
              ms
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <ThumbsUp className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Votes Cast
            </div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {
                Object.values(votes).filter((v) => v === "up" || v === "down")
                  .length
              }
            </div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <div className="w-6 h-6 bg-orange-600 dark:bg-orange-500 rounded mx-auto mb-1"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Words
            </div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {Object.keys(metrics).length > 0
                ? Object.values(metrics).reduce(
                    (sum, m) => sum + m.wordCount,
                    0,
                  )
                : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div
        className={`grid grid-cols-1 ${comparisons.length === 2 ? "lg:grid-cols-2" : comparisons.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-4"} gap-6`}
      >
        {comparisons.map((comparison, index) => {
          const modelMetrics = metrics[comparison.model] || {};
          const isWinner = votes[comparison.model] === "up";
          const isFastest =
            modelMetrics.responseTime === getBestMetric("responseTime");
          const isLongest =
            modelMetrics.wordCount === getBestMetric("wordCount");

          return (
            <div
              key={comparison.model}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 shadow-lg transition-all duration-300 ${
                isWinner
                  ? "border-green-400 dark:border-green-500 shadow-green-100 dark:shadow-green-900/50"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Model Header */}
              <div
                className={`p-4 rounded-t-xl ${
                  isWinner
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {comparison.model}
                    </h3>
                    <div className="flex space-x-2 mt-1">
                      {isFastest && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          ⚡ Fastest
                        </span>
                      )}
                      {isLongest && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          📝 Most Detailed
                        </span>
                      )}
                      {isWinner && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full">
                          🏆 Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        handleVote(
                          comparison.model,
                          votes[comparison.model] === "up" ? null : "up",
                        )
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        votes[comparison.model] === "up"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800/50"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleVote(
                          comparison.model,
                          votes[comparison.model] === "down" ? null : "down",
                        )
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        votes[comparison.model] === "down"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800/50"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Response Content with Markdown */}
              <div className="p-4">
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 mb-4">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, "")}
                          />
                        ) : (
                          <code
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 mt-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-3">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-3 text-gray-700 dark:text-gray-300 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-3 text-gray-700 dark:text-gray-300 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700 dark:text-gray-300">
                          {children}
                        </li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 pl-4 py-2 mb-3 bg-blue-50 dark:bg-blue-900/30 text-gray-700 dark:text-gray-300 italic">
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                          {children}
                        </td>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-gray-900 dark:text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-700 dark:text-gray-300">
                          {children}
                        </em>
                      ),
                    }}
                  >
                    {comparison.response}
                  </Markdown>
                </div>

                <button
                  onClick={() => copyResponse(comparison.response)}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Response</span>
                </button>
              </div>

              {/* Metrics */}
              <div className="px-4 pb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Response Time:
                      </span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">
                        {Math.round(modelMetrics.responseTime || 0)}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Words:
                      </span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">
                        {modelMetrics.wordCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Characters:
                      </span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">
                        {modelMetrics.charCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Sentences:
                      </span>
                      <span className="ml-1 font-medium text-gray-800 dark:text-white">
                        {modelMetrics.sentences || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
