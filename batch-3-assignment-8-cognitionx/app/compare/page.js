"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { ModelComparisonInterface } from "@/components/ModelComparisonInterface";
import { useRouter } from "next/navigation";
import { Bot, Zap, TrendingUp } from "lucide-react";

export default function ComparePage() {
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [comparisons, setComparisons] = useState([]);
  const [votes, setVotes] = useState({}); // Add votes state
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState("");
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();

  const getStorageKey = () => {
    return user?.id ? `aiComparison_${user.id}` : "aiComparison_guest";
  };

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const savedState = localStorage.getItem(getStorageKey());

      if (savedState) {
        try {
          const {
            savedPrompt,
            savedComparisons,
            savedSelectedModels,
            savedVotes,
          } = JSON.parse(savedState);

          if (savedPrompt) {
            setPrompt(savedPrompt);
          }
          if (savedComparisons && savedComparisons.length > 0) {
            setComparisons(savedComparisons);
          }
          if (savedSelectedModels && savedSelectedModels.length > 0) {
            setSelectedModels(savedSelectedModels);
          }
          if (savedVotes) {
            setVotes(savedVotes);
          }
        } catch (err) {
          console.error("Failed to load saved comparison state:", err);
        }
      }

      setHasLoadedFromStorage(true);
    }
  }, [user]);

  useEffect(() => {
    if (!hasLoadedFromStorage || !user) {
      return;
    }

    if (typeof window !== "undefined") {
      const stateToSave = {
        savedPrompt: prompt,
        savedComparisons: comparisons,
        savedSelectedModels: selectedModels,
        savedVotes: votes,
        timestamp: new Date().toISOString(),
        userId: user.id,
      };

      localStorage.setItem(getStorageKey(), JSON.stringify(stateToSave));
    }
  }, [prompt, comparisons, selectedModels, votes, hasLoadedFromStorage, user]); // Add votes to dependency array

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    fetchModels();
  }, [isAuthenticated, authLoading, router]);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      setModels(data.models || []);

      const savedState = localStorage.getItem(getStorageKey());
      let hasSavedModels = false;

      if (savedState) {
        try {
          const { savedSelectedModels } = JSON.parse(savedState);
          hasSavedModels =
            savedSelectedModels && savedSelectedModels.length > 0;
        } catch (err) {
          console.error("Error checking saved models:", err);
        }
      }

      if (
        !hasSavedModels &&
        selectedModels.length === 0 &&
        data.models &&
        data.models.length >= 2
      ) {
        setSelectedModels([data.models[0].name, data.models[1].name]);
      }
    } catch (err) {
      setError("Failed to load AI models");
    }
  };

  const handleModelSelection = (modelName) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelName)) {
        return prev.filter((m) => m !== modelName);
      } else if (prev.length < 4) {
        return [...prev, modelName];
      }
      return prev;
    });
  };

  const startComparison = async () => {
    if (!prompt.trim() || selectedModels.length < 2) {
      setError("Please enter a prompt and select at least 2 models");
      return;
    }

    setIsComparing(true);
    setError("");

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          models: selectedModels,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start comparison");
      }

      const data = await response.json();
      setComparisons(data.comparisons);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsComparing(false);
    }
  };

  const saveComparison = async (comparisonData) => {
    try {
      await fetch("/api/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comparisonData),
      });
    } catch (err) {
      console.error("Failed to save comparison:", err);
    }
  };

  const handleVoteChange = (model, voteType) => {
    setVotes((prev) => ({
      ...prev,
      [model]: voteType,
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              AI Model Comparison
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Compare responses from different AI models side-by-side
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
              <div className="flex items-center space-x-3">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {models.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Available Models
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedModels.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Selected Models
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {comparisons.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Comparisons Made
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Select Models to Compare
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {models.map((model) => (
                <button
                  key={model.name}
                  onClick={() => handleModelSelection(model.name)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedModels.includes(model.name)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                  disabled={
                    !selectedModels.includes(model.name) &&
                    selectedModels.length >= 4
                  }
                >
                  <div className="font-medium">
                    {model.displayName || model.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {selectedModels.includes(model.name)
                      ? "Selected"
                      : "Available"}
                  </div>
                </button>
              ))}
            </div>
            {selectedModels.length >= 4 && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                Maximum 4 models can be compared at once
              </p>
            )}
          </div>

          {/* Prompt Input */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Enter Your Prompt
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the prompt you want to send to all selected models..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {prompt.length}/2000 characters
              </span>
              <button
                onClick={startComparison}
                disabled={
                  !prompt.trim() || selectedModels.length < 2 || isComparing
                }
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isComparing ? "Comparing..." : "Start Comparison"}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Comparison Results */}
          {comparisons.length > 0 && (
            <ModelComparisonInterface
              comparisons={comparisons}
              onSave={saveComparison}
              prompt={prompt}
              votes={votes}
              onVoteChange={handleVoteChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}
