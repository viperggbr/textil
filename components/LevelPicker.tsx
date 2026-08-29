"use client";

import { LEVELS } from "@/lib/levels";
import type { LevelId } from "@/lib/types";

export function LevelPicker({
  value,
  onChange,
  disabled,
}: {
  value: LevelId;
  onChange: (id: LevelId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex shrink-0 rounded-full border border-black/10 bg-white/60 p-0.5 text-xs dark:border-white/10 dark:bg-white/5">
      {LEVELS.map((level) => {
        const active = level.id === value;
        return (
          <button
            key={level.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level.id)}
            className={`rounded-full px-3 py-1 font-medium transition-colors disabled:opacity-50 ${
              active
                ? "bg-indigo-600 text-white"
                : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            }`}
          >
            {level.label}
          </button>
        );
      })}
    </div>
  );
}
