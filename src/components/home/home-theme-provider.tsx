"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type HomeTheme = "library" | "classic" | "glass" | "dark";

type ThemeContextType = {
  theme: HomeTheme;
  setTheme: (theme: HomeTheme) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
};

const HomeThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "readora-home-theme";
const MOTION_STORAGE_KEY = "readora-home-reduce-motion";

export function HomeThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<HomeTheme>("library");
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as HomeTheme | null;
      if (savedTheme && ["library", "classic", "glass", "dark"].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      const savedMotion = window.localStorage.getItem(MOTION_STORAGE_KEY);
      if (savedMotion !== null) {
        setReduceMotionState(savedMotion === "true");
      }
    } catch {
      // Safe fallback
    }
    setMounted(true);
  }, []);

  const setTheme = (nextTheme: HomeTheme) => {
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Safe fallback
    }
  };

  const setReduceMotion = (nextMotion: boolean) => {
    setReduceMotionState(nextMotion);
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, String(nextMotion));
    } catch {
      // Safe fallback
    }
  };

  const activeThemeClass = mounted ? `theme-${theme}` : "theme-library";

  return (
    <HomeThemeContext.Provider value={{ theme, setTheme, reduceMotion, setReduceMotion }}>
      <div className={`min-h-screen transition-colors duration-500 ${activeThemeClass}`} style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}>
        {children}
      </div>
    </HomeThemeContext.Provider>
  );
}

export function useHomeTheme() {
  const context = useContext(HomeThemeContext);
  if (!context) {
    throw new Error("useHomeTheme must be used within a HomeThemeProvider");
  }
  return context;
}
