import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 1. Import the Toaster component
import { Toaster } from "react-hot-toast";

import { DownloadsProvider } from "./context/DownloadsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DownloadsProvider>
      <App />
      {/* 2. Add the Toaster component here */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          // Define default options
          duration: 3000,
          style: {
            background: "#334155", // slate-700
            color: "#fff",
            border: "1px solid #475569", // slate-600
          },
          // Default options for specific types
          success: {
            duration: 2000,
            iconTheme: {
              primary: "#22c55e", // green-500
              secondary: "white",
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "#ef4444", // red-500
              secondary: "white",
            },
          },
        }}
      />
    </DownloadsProvider>
  </React.StrictMode>,
);
