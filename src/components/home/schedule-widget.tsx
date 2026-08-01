"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Image from "next/image";

const days = [
  { day: "Sun", date: 11, active: false },
  { day: "Mon", date: 12, active: false },
  { day: "Tue", date: 13, active: true },
  { day: "Wed", date: 14, active: false },
  { day: "Thu", date: 15, active: false },
  { day: "Fri", date: 16, active: false },
  { day: "Sat", date: 17, active: false },
];

const friends = [
  {
    id: 1,
    name: "Roberto Jordan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    comment: "What a delightful and magical chapter it is! It indeed transports readers to the wizarding world..",
    chapter: "Chapter-Five: Diagon Alley",
    time: "2 min ago",
  },
  {
    id: 2,
    name: "Anna Henry",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    comment: "I finished reading the chapter last night and the plot twist left me completely speechless!",
    chapter: "Chapter-Eight: The Potions Master",
    time: "1 hour ago",
  },
];

export function ScheduleWidget() {
  const [selectedDay, setSelectedDay] = useState(13);

  return (
    <aside className="space-y-8 my-6">
      {/* 1. Schedule Reading */}
      <div className="rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-main)" }}>
            Schedule Reading
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-dim)" }}>
              <ChevronLeft size={14} />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-dim)" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Calendar Days Row */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((d) => {
            const isSelected = selectedDay === d.date;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className={`flex flex-col items-center justify-center rounded-2xl py-3 text-xs transition ${
                  isSelected ? "shadow-md scale-105" : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                style={{
                  backgroundColor: isSelected ? "var(--bg-desk)" : "transparent",
                  color: isSelected ? "var(--accent-brass)" : "var(--text-dim)",
                  border: isSelected ? "1px solid var(--border-strong)" : "1px solid transparent",
                }}
              >
                <span className="text-[10px] uppercase font-semibold">{d.day}</span>
                <strong className="mt-1 font-display text-sm">{d.date}</strong>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Reader Friends */}
      <div className="rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-main)" }}>
            Reader Friends
          </h3>
          <span className="text-xs font-semibold tracking-widest uppercase opacity-40">••</span>
        </div>

        {/* Friends Activity Feed */}
        <div className="space-y-6">
          {friends.map((f) => (
            <div key={f.id} className="flex gap-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border shadow-xs" style={{ borderColor: "var(--border-subtle)" }}>
                <Image src={f.avatar} alt={f.name} fill className="object-cover" unoptimized />
              </div>

              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold" style={{ color: "var(--text-main)" }}>
                  {f.name}
                </h4>
                <p className="text-xs italic leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {`"${f.comment}"`}
                </p>

                <div className="flex items-center justify-between text-[10px] pt-1" style={{ color: "var(--text-dim)" }}>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--accent-brass)" }}>
                    <Check size={11} /> {f.chapter}
                  </span>
                  <span>{f.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
