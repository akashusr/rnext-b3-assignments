import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  // Handle server-side rendering scenario
  if (typeof window === "undefined") return "auto";

  // Get theme from localStorage, defaulting to 'auto' if not found
  return localStorage.getItem("theme") || "auto";
};

export function ThemeProvider({ children }) {
  // Initialize state with the result of getInitialTheme()
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Update data-theme accordingly if user selects light or dark
    if (theme !== "auto") {
      document.documentElement.dataset.theme = theme;
      return;
    }

    // For auto mode, we need to watch system preferences
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial theme based on system preference
    document.documentElement.dataset.theme = mediaQuery.matches
      ? "dark"
      : "light";

    // Update theme when system preference changes
    function handleChange(e) {
      document.documentElement.dataset.theme = e.matches ? "dark" : "light";
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

// Custom hook for easy theme access
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
