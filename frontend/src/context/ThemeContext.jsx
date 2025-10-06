import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedPrefs = window.localStorage.getItem("theme");
      if (typeof storedPrefs === "string") {
        return storedPrefs;
      }
      // If no preference, check system preference
      const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
      if (userMedia.matches) {
        return "dark";
      }
    }
    return "light"; // Default light
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(theme);

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
