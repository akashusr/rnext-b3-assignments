"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Provides global theme (light/dark/system) control using Tailwind's class strategy.
const ThemeContext = createContext({
  theme: "system",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("system"); // 'light' | 'dark' | 'system'

  const applyTheme = useCallback((t) => {
    const root = document.documentElement;
    let effective = t;
    if (t === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      effective = prefersDark ? "dark" : "light";
    }
    if (effective === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "system") {
        setTheme(stored);
        applyTheme(stored);
      } else {
        applyTheme("system");
      }
    } catch {}
  }, [applyTheme]);

  useEffect(() => {
    if (!theme) return;
    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme, applyTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    try {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } catch {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, [theme, applyTheme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
