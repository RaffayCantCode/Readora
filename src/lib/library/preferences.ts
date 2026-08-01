"use client";

import { useEffect, useState } from "react";
import type { LibraryPreferences } from "./types";

const STORAGE_KEY = "readora-library-preferences";
const defaults: LibraryPreferences = { mode: "immersive", reduceMotion: false };

export function useLibraryPreferences() {
  const [preferences, setPreferences] = useState<LibraryPreferences>(defaults);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setPreferences({ ...defaults, ...JSON.parse(saved) as Partial<LibraryPreferences> });
    } catch {
      // Keep safe defaults when storage is unavailable.
    }
  }, []);
  function update(next: Partial<LibraryPreferences>) {
    setPreferences((current) => {
      const value = { ...current, ...next };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return value;
    });
  }
  return { preferences, update };
}
