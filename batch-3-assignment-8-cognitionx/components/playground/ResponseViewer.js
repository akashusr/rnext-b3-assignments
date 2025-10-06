import React from "react";
import { Copy, Download, RefreshCw } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";

export function ResponseViewer({ response, isLoading, error, onCopy }) {
  const downloadResponse = () => {
    if (!response) return;

    const blob = new Blob([response], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300">
            Generating response...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
              <span className="text-red-600 dark:text-red-300 text-sm font-bold">
                !
              </span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
              Request Failed
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🤖</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Run a test to see the AI response here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Response Actions */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Response ({response.length} characters)
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onCopy}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
          <button
            onClick={downloadResponse}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Response Content */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert">
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
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono"
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
                <li className="text-gray-700 dark:text-gray-300">{children}</li>
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
                <thead className="bg-gray-100 dark:bg-gray-800">
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
            {response}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
