"use client";

import { PERSONAS } from "@/lib/personas";
import type { PersonaId } from "@/lib/types";

export function PersonaPicker({
  value,
  onChange,
  disabled,
}: {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {PERSONAS.map((persona) => {
        const active = persona.id === value;
        return (
          <button
            key={persona.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(persona.id)}
            title={persona.tagline}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? persona.theme.chipActive
                : "border-black/10 bg-white/60 text-black/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            <span className="text-base leading-none">{persona.emoji}</span>
            {persona.name}
          </button>
        );
      })}
    </div>
  );
}
