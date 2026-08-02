"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, UserPlus } from "lucide-react";

const days = [
  { day: "Sun", date: 11, active: false },
  { day: "Mon", date: 12, active: false },
  { day: "Tue", date: 13, active: true },
  { day: "Wed", date: 14, active: false },
  { day: "Thu", date: 15, active: false },
  { day: "Fri", date: 16, active: false },
  { day: "Sat", date: 17, active: false },
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

      {/* 2. Reader Friends Section */}
      <div className="rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-main)" }}>
            Reader Friends
          </h3>
          <span className="rounded-full bg-brass/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brass">
            Social
          </span>
        </div>

        {/* Add Friends Social Feature Card */}
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border space-y-4" style={{ backgroundColor: "var(--bg-desk)", borderColor: "var(--border-subtle)" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)", color: "var(--accent-brass)" }}>
            <Users size={22} />
          </div>

          <div className="space-y-1">
            <h4 className="font-display text-sm font-bold" style={{ color: "var(--text-main)" }}>
              Connect With Readers
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
              Add friends and see what they have been up to!
            </p>
          </div>

          <button
            onClick={() => alert("Social features coming soon! You will be able to add friends and share notes.")}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--accent-brass)",
              color: "var(--bg-main)",
            }}
          >
            <UserPlus size={14} />
            <span>Add Friends</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
