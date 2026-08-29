"use client";

export function VoiceSettings({
  autoSpeak,
  onToggleAutoSpeak,
  voices,
  voiceURI,
  onChangeVoice,
  isSupported,
}: {
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  voices: SpeechSynthesisVoice[];
  voiceURI: string | null;
  onChangeVoice: (uri: string) => void;
  isSupported: boolean;
}) {
  if (!isSupported) {
    return (
      <p className="text-xs text-black/40 dark:text-white/40">
        Síntese de voz não suportada neste navegador.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        type="button"
        onClick={onToggleAutoSpeak}
        aria-pressed={autoSpeak}
        className={`rounded-full border px-2.5 py-1 font-medium transition-colors ${
          autoSpeak
            ? "border-indigo-500 bg-indigo-500 text-white"
            : "border-black/10 text-black/50 dark:border-white/10 dark:text-white/50"
        }`}
      >
        {autoSpeak ? "🔊 fala automática" : "🔈 fala automática"}
      </button>
      {voices.length > 1 && (
        <select
          value={voiceURI ?? ""}
          onChange={(e) => onChangeVoice(e.target.value)}
          className="max-w-[9rem] rounded-full border border-black/10 bg-white px-2 py-1 text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
        >
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
