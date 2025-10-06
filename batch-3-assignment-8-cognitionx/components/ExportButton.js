import { useState } from "react";
import {
  Download,
  FileText,
  FileJson,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { exportFormats } from "@/lib/exportUtils";

export function ExportButton({ conversationId, className = "" }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowDropdown(false);

    try {
      const response = await fetch(
        `/api/conversation/${conversationId}/export?format=${format}`,
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `conversation_export.${format}`;

      // Create blob and download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export conversation. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: exportFormats.MARKDOWN,
      label: "Markdown (.md)",
      icon: FileText,
      description: "Human-readable format with formatting",
    },
    {
      format: exportFormats.JSON,
      label: "JSON (.json)",
      icon: FileJson,
      description: "Structured data format",
    },
    {
      format: exportFormats.TXT,
      label: "Plain Text (.txt)",
      icon: File,
      description: "Simple text format",
    },
    {
      format: exportFormats.CSV,
      label: "CSV (.csv)",
      icon: FileSpreadsheet,
      description: "Spreadsheet format",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className={`p-1 hover:bg-gray-700 rounded transition-colors ${className}`}
        title="Export conversation"
      >
        <Download
          className={`w-4 h-4 text-gray-400 ${isExporting ? "animate-spin" : ""}`}
        />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Export as:
            </div>
            {exportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors text-sm"
                >
                  <IconComponent className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
