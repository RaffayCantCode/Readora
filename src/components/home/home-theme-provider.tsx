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
      <div className={`relative min-h-screen transition-colors duration-700 ${activeThemeClass}`} style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}>
        {/* Atmosphere Vibe Backdrops */}
        {theme === "library" && (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-80 transition-opacity duration-700">
            {/* Warm Library Lantern Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(212,152,69,0.22)_0%,transparent_70%)]" />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="wood-grain absolute inset-0 opacity-20" />
          </div>
        )}

        {theme === "glass" && (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-90 transition-opacity duration-700">
            {/* Frosted White Light Leak & Crystal Spheres */}
            <div className="absolute -top-32 right-10 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_70%)] blur-3xl" />
            <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
          </div>
        )}

        {theme === "classic" && (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-50 transition-opacity duration-700">
            <div className="paper-grain absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.04)_100%)]" />
          </div>
        )}

        {theme === "dark" && (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-70 transition-opacity duration-700">
            <div className="absolute top-0 right-1/4 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(229,152,25,0.08)_0%,transparent_70%)] blur-2xl" />
          </div>
        )}

        {/* Page Content */}
        <div className="relative z-10">{children}</div>
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
