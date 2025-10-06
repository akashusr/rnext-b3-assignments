import React, { useRef } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const SettingsPage = () => {
  const fileInputRef = useRef(null);
  const allLocalStorageKeys = [
    "lws-ai-settings",
    "lws-ai-generated-data",
    "lws-ai-prompt-history",
    "lws-ai-downloads",
    "lws-ai-favourites",
    "lws-ai-collections",
  ];

  const handleExport = () => {
    try {
      const backupData = {};
      allLocalStorageKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          backupData[key] = JSON.parse(data);
        }
      });

      if (Object.keys(backupData).length === 0) {
        showErrorToast("No data found to export.");
        return;
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split("T")[0];
      link.download = `lws-ai-studio-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccessToast("Data exported successfully!");
    } catch (error) {
      showErrorToast(`Export failed: ${error.message}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      showErrorToast("Invalid file type. Please select a JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (
          !window.confirm(
            "Are you sure you want to import this data? This will overwrite all your current settings, history, and collections.",
          )
        ) {
          return;
        }

        allLocalStorageKeys.forEach((key) => localStorage.removeItem(key));

        Object.keys(importedData).forEach((key) => {
          if (allLocalStorageKeys.includes(key)) {
            localStorage.setItem(key, JSON.stringify(importedData[key]));
          }
        });

        showSuccessToast(
          "Data imported successfully! The app will now reload.",
        );

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        showErrorToast(`Import failed: ${error.message}`);
      } finally {
        event.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (
      !window.confirm(
        "DANGER! This will permanently delete all your generated images, settings, history, favorites, and collections. This action cannot be undone. Are you absolutely sure?",
      )
    ) {
      return;
    }

    try {
      allLocalStorageKeys.forEach((key) => localStorage.removeItem(key));
      showSuccessToast(
        "All application data has been cleared. The app will now reload.",
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showErrorToast(`Failed to clear data: ${error.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">
        Settings & Data Management <span className="text-2xl">⚙️</span>
      </h2>

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-2">
            Export Your Data
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Save a backup of all your settings, prompt history, favorites,
            downloads, and collections to a single JSON file. Keep this file in
            a safe place.
          </p>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export Data
          </button>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-2">
            Import Your Data
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Restore your data from a previously exported backup file.
            <span className="font-bold text-yellow-400 block mt-2">
              Warning: This will overwrite all current data in the application.
            </span>
          </p>
          <button
            onClick={handleImportClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Import from File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            className="hidden"
            accept="application/json"
          />
        </div>

        <div className="border-t-2 border-dashed border-red-500/30 my-8"></div>

        <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-red-400 mb-4">
            Permanently delete all application data from your browser. This
            action cannot be undone. It's recommended to export your data first.
          </p>
          <button
            onClick={handleClearAllData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
          >
            <TrashIcon className="w-5 h-5" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
