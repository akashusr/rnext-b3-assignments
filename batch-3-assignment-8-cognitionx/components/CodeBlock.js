import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export const CodeBlock = ({
  children,
  className,
  node,
  theme = "dark",
  showLineNumbers = true,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  // Extract language from className (format: "language-javascript")
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  // Get the code content
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // For inline code (no language specified or single line)
  if (!match || code.split("\n").length === 1) {
    return (
      <code
        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4">
      {/* Language label and copy button */}
      <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <span className="text-sm font-medium capitalize">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax highlighted code */}
      <div className="rounded-b-lg overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={theme === "dark" ? oneDark : oneLight}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "14px",
            lineHeight: "1.5",
          }}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: theme === "dark" ? "#6b7280" : "#9ca3af",
            borderRight: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            marginRight: "1em",
          }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Pre-configured themes for different contexts
export const themes = {
  dark: oneDark,
  light: oneLight,
};

// Common programming languages with their display names
export const languageNames = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
  markdown: "Markdown",
  bash: "Bash",
  shell: "Shell",
  powershell: "PowerShell",
  dockerfile: "Dockerfile",
  nginx: "Nginx",
  apache: "Apache",
  react: "React JSX",
  vue: "Vue",
  angular: "Angular",
  svelte: "Svelte",
};
