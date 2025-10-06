import React, { useState, useEffect } from "react";

const ChevronIcon = ({ collapsed }) => (
  <svg
    className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "-rotate-90" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const PromptHistory = ({ history, onSelect, onClear }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [justAddedPrompt, setJustAddedPrompt] = useState(null);

  useEffect(() => {
    if (history && history.length > 0) {
      const latestPrompt = history[0]?.prompt;
      setJustAddedPrompt(latestPrompt);
      const timer = setTimeout(() => setJustAddedPrompt(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [history]);

  const filteredHistory = (history || []).filter((item) =>
    String(item?.prompt || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="border border-zinc-700/70 p-4 rounded-lg mb-6 bg-zinc-900/10 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-zinc-200 text-sm flex items-center gap-1">
          <button
            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronIcon collapsed={collapsed} />
            Prompt History {history?.length > 0 && `(${history.length})`}
          </button>
        </h4>
        {history?.length > 0 && (
          <button
            className="text-xs text-red-400 hover:underline"
            onClick={onClear}
          >
            Clear All
          </button>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          collapsed ? "max-h-0 opacity-0" : "max-h-60 opacity-100"
        }`}
      >
        <div className="w-full mb-2 rounded border border-zinc-700/70 bg-[#0f0f0f] focus-within:ring-2 focus-within:ring-purple-500 transition">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-transparent rounded text-white placeholder-zinc-400 focus:outline-none"
          />
        </div>

        <ul className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
          {filteredHistory.length === 0 ? (
            <li className="text-zinc-500 text-sm italic">
              No prompt history yet. Start generating!
            </li>
          ) : (
            filteredHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => onSelect(item.prompt)}
                className={`flex items-center gap-2 text-sm cursor-pointer truncate px-2 py-1 rounded transition-colors
                  ${item.prompt === justAddedPrompt ? "animate-pulse bg-green-600/20" : ""}
                  hover:bg-zinc-800/40 hover:text-white text-zinc-300`}
                title={item.prompt}
              >
                <span className="truncate">{item.prompt}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default PromptHistory;
