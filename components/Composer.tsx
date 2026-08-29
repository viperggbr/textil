"use client";

import { useState, type FormEvent } from "react";

export function Composer({
  onSend,
  disabled,
  isListening,
  isSupported,
  interimTranscript,
  onToggleMic,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  onToggleMic: () => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="border-t border-black/10 bg-white/80 px-3 py-3 backdrop-blur sm:px-4 dark:border-white/10 dark:bg-black/40">
      {isListening && (
        <p className="mb-2 truncate px-1 text-sm text-indigo-600 dark:text-indigo-400">
          🎙️ {interimTranscript || "escutando..."}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {isSupported && (
          <button
            type="button"
            onClick={onToggleMic}
            disabled={disabled}
            aria-pressed={isListening}
            aria-label={isListening ? "Parar de escutar" : "Falar em francês"}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg transition-colors disabled:opacity-50 ${
              isListening
                ? "animate-pulse bg-red-500 text-white shadow-lg shadow-red-500/40"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {isListening ? "⏹️" : "🎙️"}
          </button>
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Écris quelque chose en français..."
          className="h-11 flex-1 rounded-full border border-black/10 bg-white px-4 text-[15px] outline-none focus:border-indigo-400 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="h-11 shrink-0 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
        >
          Enviar
        </button>
      </form>
      {!isSupported && (
        <p className="mt-1.5 px-1 text-xs text-black/40 dark:text-white/40">
          Reconhecimento de voz não é suportado neste navegador — tente Chrome ou Edge para falar no
          microfone. Por enquanto, digite sua resposta.
        </p>
      )}
    </div>
  );
}
