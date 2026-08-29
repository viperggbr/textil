"use client";

import { useEffect, useRef, useState } from "react";

import { ChatBubble } from "@/components/ChatBubble";
import { Composer } from "@/components/Composer";
import { LevelPicker } from "@/components/LevelPicker";
import { PersonaPicker } from "@/components/PersonaPicker";
import { VoiceSettings } from "@/components/VoiceSettings";
import { useChat } from "@/hooks/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { getPersona } from "@/lib/personas";

export default function Home() {
  const {
    personaId,
    setPersonaId,
    levelId,
    setLevelId,
    messages,
    isSending,
    error,
    sendMessage,
    resetConversation,
  } = useChat();

  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceURI, setVoiceURI] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { speak, cancel, isSupported: ttsSupported, voices } = useSpeechSynthesis();

  const persona = getPersona(personaId);

  const speakAsPersona = (text: string) => {
    speak(text, { voiceURI, pitch: persona.voice.pitch, rate: persona.voice.rate });
  };

  const handleSend = async (text: string) => {
    const assistantMessage = await sendMessage(text);
    if (assistantMessage && autoSpeak && ttsSupported) {
      speakAsPersona(assistantMessage.textFr);
    }
  };

  const { isSupported: sttSupported, isListening, interimTranscript, start, stop } = useSpeechRecognition({
    lang: "fr-FR",
    onResult: (text) => {
      void handleSend(text);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const handleToggleMic = () => {
    if (isListening) {
      stop();
    } else {
      cancel();
      start();
    }
  };

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col">
      <header className="flex flex-col gap-3 border-b border-black/10 bg-white/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">
            🇫🇷 Salut<span className={persona.theme.accent}>!</span>
          </h1>
          <button
            type="button"
            onClick={resetConversation}
            className="text-xs font-medium text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
          >
            🗑️ nova conversa
          </button>
        </div>

        <PersonaPicker value={personaId} onChange={setPersonaId} disabled={isSending} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <LevelPicker value={levelId} onChange={setLevelId} disabled={isSending} />
          <VoiceSettings
            autoSpeak={autoSpeak}
            onToggleAutoSpeak={() => setAutoSpeak((v) => !v)}
            voices={voices}
            voiceURI={voiceURI}
            onChangeVoice={setVoiceURI}
            isSupported={ttsSupported}
          />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-black/40 dark:text-white/40">
            <p className="text-3xl">{persona.emoji}</p>
            <p className="max-w-xs text-sm">
              {persona.name} está esperando você dizer <span className="italic">&quot;Bonjour!&quot;</span>.
              Fale no microfone ou digite abaixo.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} onReplay={ttsSupported ? speakAsPersona : undefined} />
        ))}

        {isSending && (
          <div className="flex items-center gap-1.5 px-1 text-sm text-black/40 dark:text-white/40">
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
            <span>{persona.name} está digitando...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}
      </div>

      <Composer
        onSend={(text) => void handleSend(text)}
        disabled={isSending}
        isListening={isListening}
        isSupported={sttSupported}
        interimTranscript={interimTranscript}
        onToggleMic={handleToggleMic}
      />
    </div>
  );
}
