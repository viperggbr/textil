"use client";

import { getPersona } from "@/lib/personas";
import type { ChatMessage } from "@/lib/types";
import { CorrectionCard } from "./CorrectionCard";

export function ChatBubble({
  message,
  onReplay,
}: {
  message: ChatMessage;
  onReplay?: (text: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-2.5 text-white shadow-sm">
          <p className="whitespace-pre-wrap text-[15px] leading-snug">{message.textFr}</p>
        </div>
      </div>
    );
  }

  const persona = getPersona(message.personaId);

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className={`max-w-[85%] rounded-2xl rounded-bl-sm border px-4 py-2.5 shadow-sm ${persona.theme.bubble}`}>
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold opacity-70">
          <span>{persona.emoji}</span>
          <span>{persona.name}</span>
          {message.moodEmoji && <span className="ml-auto">{message.moodEmoji}</span>}
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-snug">{message.textFr}</p>
        {message.textPt && <p className="mt-1 text-[13px] italic opacity-60">{message.textPt}</p>}
        {onReplay && (
          <button
            type="button"
            onClick={() => onReplay(message.textFr)}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium opacity-70 hover:opacity-100"
          >
            🔊 ouvir de novo
          </button>
        )}
      </div>
      {message.correction && <CorrectionCard correction={message.correction} persona={persona} />}
    </div>
  );
}
