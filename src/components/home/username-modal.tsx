"use client";

import { useEffect, useState } from "react";
import { User, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UsernameModal({
  onSave,
}: {
  onSave: (username: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    try {
      const savedName = window.localStorage.getItem("readora-user-name");
      if (!savedName) {
        setIsOpen(true);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim() || "Reader";
    try {
      window.localStorage.setItem("readora-user-name", trimmed);
    } catch {
      // safe fallback
    }
    onSave(trimmed);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-lg bg-black/75"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border p-8 shadow-2xl"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text-main)",
          }}
        >
          {/* Header Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner mb-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--accent-glow)" }}>
            <Sparkles size={24} style={{ color: "var(--accent-brass)" }} />
          </div>

          <div className="text-center space-y-2 mb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-main)" }}>
              Welcome to Readora
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
              Enter your name to personalize your digital library archive experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-dim)" }} />
              <input
                type="text"
                required
                autoFocus
                placeholder="Enter your name (e.g. Harvey)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-2xl border py-3.5 pl-11 pr-4 text-xs font-semibold shadow-inner focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-strong)",
                  color: "var(--text-main)",
                }}
              />
            </div>

            <button
              type="submit"
              className="flex w-full h-12 items-center justify-center gap-2 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition hover:scale-[1.02] active:scale-95"
              style={{
                backgroundColor: "var(--text-main)",
                color: "var(--bg-main)",
              }}
            >
              <span>Enter Archive</span>
              <Check size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
