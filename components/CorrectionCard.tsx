import type { Correction, Persona } from "@/lib/types";

export function CorrectionCard({ correction, persona }: { correction: Correction; persona: Persona }) {
  if (!correction.had_mistake) {
    if (!correction.note_pt) return null;
    return (
      <div className="ml-1 max-w-[85%] rounded-xl border border-dashed border-black/10 bg-black/[0.02] px-3 py-2 text-xs text-black/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50">
        ✅ {correction.note_pt}
      </div>
    );
  }

  return (
    <div className="ml-1 max-w-[85%] rounded-xl border border-dashed border-black/15 bg-black/[0.03] px-3 py-2 text-xs dark:border-white/15 dark:bg-white/[0.04]">
      <div className="mb-1 font-semibold text-black/50 dark:text-white/50">📝 correção</div>
      {correction.original && (
        <p className="text-black/70 line-through decoration-red-500/70 dark:text-white/60">
          {correction.original}
        </p>
      )}
      {correction.fixed && (
        <p className="mt-0.5 font-medium text-emerald-700 dark:text-emerald-400">{correction.fixed}</p>
      )}
      {correction.note_pt && <p className={`mt-1.5 ${persona.theme.accent}`}>{correction.note_pt}</p>}
    </div>
  );
}
