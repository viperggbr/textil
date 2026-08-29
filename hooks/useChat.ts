"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DEFAULT_LEVEL_ID } from "@/lib/levels";
import { DEFAULT_PERSONA_ID } from "@/lib/personas";
import { newId } from "@/lib/utils";
import type { ChatMessage, LevelId, PersonaId, TutorResponse } from "@/lib/types";

const STORAGE_KEY = "textil.salut-frances.v1";

interface StoredState {
  personaId: PersonaId;
  levelId: LevelId;
  messages: ChatMessage[];
}

function loadStored(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (!Array.isArray(parsed.messages)) return null;
    return {
      personaId: parsed.personaId ?? DEFAULT_PERSONA_ID,
      levelId: parsed.levelId ?? DEFAULT_LEVEL_ID,
      messages: parsed.messages,
    };
  } catch {
    return null;
  }
}

export function useChat() {
  const [personaId, setPersonaId] = useState<PersonaId>(DEFAULT_PERSONA_ID);
  const [levelId, setLevelId] = useState<LevelId>(DEFAULT_LEVEL_ID);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Hydrate from localStorage once, client-side only. This has to run in an
  // effect (not a lazy useState initializer) since localStorage isn't
  // available during SSR - reading it during render would either throw on
  // the server or produce a client/server output mismatch.
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from an external store (localStorage), not derived state
      setPersonaId(stored.personaId);
      setLevelId(stored.levelId);
      setMessages(stored.messages);
    }
    hydrated.current = true;
  }, []);

  // Persist on change, skipping the render that happens before hydration runs.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ personaId, levelId, messages }));
    } catch {
      // Storage full or unavailable (e.g. private browsing) - not critical, ignore.
    }
  }, [personaId, levelId, messages]);

  const sendMessage = useCallback(
    async (text: string): Promise<ChatMessage | null> => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return null;

      const userMessage: ChatMessage = {
        id: newId(),
        role: "user",
        createdAt: Date.now(),
        textFr: trimmed,
      };

      const historySoFar = [...messages, userMessage].slice(-20).map((m) => ({
        role: m.role,
        text: m.textFr,
      }));

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personaId, levelId, message: trimmed, history: historySoFar }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Erro ao falar com a IA.");
        }

        const result = data.result as TutorResponse;

        const assistantMessage: ChatMessage = {
          id: newId(),
          role: "assistant",
          createdAt: Date.now(),
          textFr: result.reply_fr,
          textPt: result.reply_pt,
          correction: result.correction,
          moodEmoji: result.mood_emoji,
          personaId,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        return assistantMessage;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado.");
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [messages, personaId, levelId, isSending]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    personaId,
    setPersonaId,
    levelId,
    setLevelId,
    messages,
    isSending,
    error,
    sendMessage,
    resetConversation,
  };
}
