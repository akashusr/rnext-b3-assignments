import React, { useState } from "react";
import { Code, Copy, Download } from "lucide-react";

export function CodeGenerator({ model, parameters, prompt, response }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const generateCode = (language) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    switch (language) {
      case "javascript":
        return `// JavaScript - Fetch API
const response = await fetch('${baseUrl}/api/playground/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: '${model}',
    message: \`${prompt.replace(/`/g, "\\`")}\`,
    systemPrompt: \`${parameters.systemPrompt.replace(/`/g, "\\`")}\`,
    temperature: ${parameters.temperature},
    maxTokens: ${parameters.maxTokens},
    topP: ${parameters.topP},
    frequencyPenalty: ${parameters.frequencyPenalty},
    presencePenalty: ${parameters.presencePenalty}
  })
});

const data = await response.json();
console.log(data.response);`;

      case "python":
        return `# Python - Requests
import requests
import json

url = '${baseUrl}/api/playground/test'
payload = {
    'model': '${model}',
    'message': '''${prompt}''',
    'systemPrompt': '''${parameters.systemPrompt}''',
    'temperature': ${parameters.temperature},
    'maxTokens': ${parameters.maxTokens},
    'topP': ${parameters.topP},
    'frequencyPenalty': ${parameters.frequencyPenalty},
    'presencePenalty': ${parameters.presencePenalty}
}

response = requests.post(url, json=payload)
data = response.json()
print(data['response'])`;

      case "curl":
        return `# cURL
curl -X POST '${baseUrl}/api/playground/test' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "model": "${model}",
    "message": "${prompt.replace(/"/g, '\\"')}",
    "systemPrompt": "${parameters.systemPrompt.replace(/"/g, '\\"')}",
    "temperature": ${parameters.temperature},
    "maxTokens": ${parameters.maxTokens},
    "topP": ${parameters.topP},
    "frequencyPenalty": ${parameters.frequencyPenalty},
    "presencePenalty": ${parameters.presencePenalty}
  }'`;

      case "nodejs":
        return `// Node.js - Axios
const axios = require('axios');

const config = {
  method: 'post',
  url: '${baseUrl}/api/playground/test',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    model: '${model}',
    message: \`${prompt.replace(/`/g, "\\`")}\`,
    systemPrompt: \`${parameters.systemPrompt.replace(/`/g, "\\`")}\`,
    temperature: ${parameters.temperature},
    maxTokens: ${parameters.maxTokens},
    topP: ${parameters.topP},
    frequencyPenalty: ${parameters.frequencyPenalty},
    presencePenalty: ${parameters.presencePenalty}
  }
};

try {
  const response = await axios(config);
  console.log(response.data.response);
} catch (error) {
  console.error(error);
}`;

      default:
        return "// Select a language to generate code";
    }
  };

  const copyCode = () => {
    const code = generateCode(selectedLanguage);
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const code = generateCode(selectedLanguage);
    const extensions = {
      javascript: "js",
      python: "py",
      curl: "sh",
      nodejs: "js",
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api-playground-example.${extensions[selectedLanguage]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languages = [
    { id: "javascript", name: "JavaScript (Fetch)" },
    { id: "nodejs", name: "Node.js (Axios)" },
    { id: "python", name: "Python (Requests)" },
    { id: "curl", name: "cURL" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <Code className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
          Generated Code
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={copyCode}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100">
          <code>{generateCode(selectedLanguage)}</code>
        </pre>
      </div>

      {response && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            💡 This code will reproduce the current test configuration and
            should return a similar response.
          </p>
        </div>
      )}
    </div>
  );
}
