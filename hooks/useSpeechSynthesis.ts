"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

interface SpeakOptions {
  voiceURI?: string | null;
  pitch?: number;
  rate?: number;
}

// Browser support never changes after load, so there's nothing to subscribe to -
// this only exists to give useSyncExternalStore an SSR-safe (false) snapshot on
// the server and the real snapshot once mounted in the browser.
function subscribeNever() {
  return () => {};
}
function getSupportSnapshot() {
  return typeof window !== "undefined" && Boolean(window.speechSynthesis);
}
function getSupportServerSnapshot() {
  return false;
}

export function useSpeechSynthesis() {
  const isSupported = useSyncExternalStore(subscribeNever, getSupportSnapshot, getSupportServerSnapshot);
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => setAllVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!isSupported || !text.trim()) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.pitch = opts.pitch ?? 1;
      utterance.rate = opts.rate ?? 1;

      const voice =
        allVoices.find((v) => v.voiceURI === opts.voiceURI) ??
        allVoices.find((v) => v.lang.toLowerCase().startsWith("fr"));
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, allVoices]
  );

  const cancel = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const voices = allVoices.filter((v) => v.lang.toLowerCase().startsWith("fr"));

  return { voices, isSpeaking, isSupported, speak, cancel };
}
