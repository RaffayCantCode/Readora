"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import type { BookMetadata } from "@/lib/books/types";
import { useHomeTheme } from "../home/home-theme-provider";

interface Book3DProps {
  book: BookMetadata;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showMetadata?: boolean;
}

// Calculate spine width in pixels based on page count
function getSpineDimensions(pageCount?: number) {
  const pages = pageCount || 340;
  if (pages > 700) {
    return { widthPx: 36, label: `${pages} pgs · Heavy Tome` };
  }
  if (pages > 450) {
    return { widthPx: 28, label: `${pages} pgs · Volume` };
  }
  if (pages > 220) {
    return { widthPx: 20, label: `${pages} pgs` };
  }
  return { widthPx: 14, label: `${pages} pgs · Slender` };
}

// Calculate unique, book-specific spine style matching the title/author
function getSpineTheme(book: BookMetadata) {
  const title = book.title || "";
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  const themes = [
    { bg: "#1e293b", text: "#f8fafc", foil: "#38bdf8" }, // Deep Navy + Sky Foil
    { bg: "#2d1b14", text: "#f5efe6", foil: "#d49845" }, // Rich Mahogany + Gold Foil
    { bg: "#162820", text: "#f4efe4", foil: "#34d399" }, // Emerald Leather + Mint Foil
    { bg: "#361619", text: "#fcf0f0", foil: "#f87171" }, // Oxblood Red + Ruby Foil
    { bg: "#281938", text: "#f5f0fc", foil: "#c084fc" }, // Imperial Violet + Amethyst Foil
    { bg: "#1f242d", text: "#fafafa", foil: "#fbbf24" }, // Charcoal + Brass Foil
  ];

  return themes[Math.abs(hash) % themes.length];
}

export function Book3D({
  book,
  onClick,
  className = "",
  size = "md",
  showMetadata = true,
}: Book3DProps) {
  const { reduceMotion } = useHomeTheme();
  const [hovered, setHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const spineInfo = getSpineDimensions(book.pageCount);
  const spineTheme = getSpineTheme(book);
  const spineWidth = spineInfo.widthPx;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate tilt angles based on mouse position
    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 22 - 18; // default rest angle
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (!reduceMotion) {
      setRotate({ x: 6, y: -24 });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Dimensions by size
  const dimensions = {
    sm: "w-28 h-40",
    md: "w-40 sm:w-44 h-60 sm:h-64",
    lg: "w-48 sm:w-56 h-72 sm:h-80",
  }[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 3D Scene Container */}
      <div
        className={`perspective-1000 relative cursor-pointer ${dimensions}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Floating Page Count Reading Info Badge on Hover */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-2xl pointer-events-none whitespace-nowrap"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-strong)",
              color: "var(--accent-brass)",
            }}
          >
            <BookOpen size={12} />
            <span>{spineInfo.label}</span>
          </motion.div>
        )}

        {/* 3D Book Object wrapper */}
        <motion.div
          className="preserve-3d relative w-full h-full rounded-md transition-transform duration-300 ease-out"
          animate={
            reduceMotion
              ? {}
              : {
                  rotateX: hovered ? rotate.x : 0,
                  rotateY: hovered ? rotate.y : -16,
                  translateZ: hovered ? 38 : 0,
                  scale: hovered ? 1.07 : 1,
                }
          }
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Front Book Cover (Pushed forward by half the spine thickness) */}
          <div
            className="absolute inset-0 z-20 rounded-r-md overflow-hidden shadow-2xl border border-white/15"
            style={{
              backgroundColor: "#1c1917",
              transform: `translateZ(${spineWidth / 2}px)`,
            }}
          >
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 150px, 220px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="book-cloth absolute inset-0 p-4 flex flex-col justify-between" style={{ backgroundColor: spineTheme.bg, color: spineTheme.text }}>
                <div className="border border-white/20 p-2 text-center h-full flex flex-col justify-between">
                  <span className="text-[8px] uppercase tracking-widest text-brass">Readora Archive</span>
                  <h4 className="font-display text-sm font-bold leading-tight">{book.title}</h4>
                  <p className="text-[10px] opacity-75">{book.authors[0]}</p>
                </div>
              </div>
            )}

            {/* Specular Dynamic Gloss Sweep Reflection Overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                background: hovered
                  ? `linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 50%, transparent 80%)`
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
                opacity: hovered ? 1 : 0.4,
                transform: hovered ? "translateX(0%)" : "translateX(-40%)",
              }}
            />

            {/* Book Crease Shadow on Spine Edge */}
            <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none" />
          </div>

          {/* Book-Specific Custom 3D Spine (Left Side - Folded 90deg backwards) */}
          <div
            className="absolute top-0 bottom-0 left-0 origin-left preserve-3d overflow-hidden flex flex-col justify-between items-center py-3 text-white border-r border-black/40"
            style={{
              width: `${spineWidth}px`,
              transform: `rotateY(-90deg) translateZ(${spineWidth / 2}px)`,
              backgroundColor: spineTheme.bg,
              boxShadow: "inset 0 0 14px rgba(0, 0, 0, 0.85)",
            }}
          >
            {/* Top Foil Band */}
            <div className="w-full h-1 my-1" style={{ backgroundColor: spineTheme.foil, opacity: 0.8 }} />

            {/* Vertical Title & Author */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="-rotate-90 whitespace-nowrap font-display text-[9px] font-extrabold tracking-widest uppercase truncate max-w-[130px]" style={{ color: spineTheme.text }}>
                {book.title} <span className="opacity-60 text-[8px] ml-1">· {book.authors[0]}</span>
              </div>
            </div>

            {/* Bottom Foil Band */}
            <div className="w-full h-1 my-1" style={{ backgroundColor: spineTheme.foil, opacity: 0.8 }} />
          </div>

          {/* 3D Layered Paper Pages Block (Right Side) */}
          <div
            className="absolute top-1 bottom-1 right-0 origin-right preserve-3d"
            style={{
              width: `${spineWidth}px`,
              transform: `rotateY(90deg) translateZ(${spineWidth / 2 - 2}px)`,
              background: "repeating-linear-gradient(90deg, #f5efe6 0 1px, #e3d7c5 1px 3px)",
              boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* 3D Top Pages Edge */}
          <div
            className="absolute top-0 left-1 right-1 origin-top preserve-3d"
            style={{
              height: `${spineWidth}px`,
              transform: `rotateX(90deg) translateZ(${spineWidth / 2}px)`,
              background: "repeating-linear-gradient(0deg, #f5efe6 0 1px, #e3d7c5 1px 3px)",
            }}
          />

          {/* 3D Bottom Pages Edge */}
          <div
            className="absolute bottom-0 left-1 right-1 origin-bottom preserve-3d"
            style={{
              height: `${spineWidth}px`,
              transform: `rotateX(-90deg) translateZ(${spineWidth / 2}px)`,
              background: "repeating-linear-gradient(0deg, #f5efe6 0 1px, #e3d7c5 1px 3px)",
            }}
          />
        </motion.div>

        {/* Dynamic Physical Floor Drop Shadow */}
        <motion.div
          className="absolute -bottom-5 inset-x-2 h-5 rounded-full pointer-events-none transition-all duration-300"
          animate={{
            scaleX: hovered ? 1.3 : 1,
            scaleY: hovered ? 1.7 : 1,
            opacity: hovered ? 0.9 : 0.45,
          }}
          style={{
            background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, transparent 80%)",
            filter: hovered ? "blur(14px)" : "blur(6px)",
          }}
        />
      </div>

      {/* Metadata Labels */}
      {showMetadata && (
        <div className="mt-3.5 w-full text-center space-y-1 px-1">
          <h4
            className="truncate font-display text-xs sm:text-sm font-bold transition-colors group-hover:text-brass"
            style={{ color: "var(--text-main)" }}
          >
            {book.title}
          </h4>
          <p className="truncate text-[11px]" style={{ color: "var(--text-dim)" }}>
            {book.authors.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
