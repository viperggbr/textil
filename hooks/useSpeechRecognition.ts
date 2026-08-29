"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface UseSpeechRecognitionOptions {
  lang?: string;
  /** Called with the final transcript once the browser is confident about it. */
  onResult?: (finalText: string) => void;
}

// Browser support never changes after load, so there's nothing to subscribe to -
// this only exists to give useSyncExternalStore an SSR-safe (false) snapshot on
// the server and the real snapshot once mounted in the browser, without a
// render -> effect -> setState -> re-render round trip.
function subscribeNever() {
  return () => {};
}
function getSupportSnapshot() {
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}
function getSupportServerSnapshot() {
  return false;
}

export function useSpeechRecognition({ lang = "fr-FR", onResult }: UseSpeechRecognitionOptions = {}) {
  const isSupported = useSyncExternalStore(subscribeNever, getSupportSnapshot, getSupportServerSnapshot);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Keep the latest callback without re-subscribing the recognizer on every render.
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0]?.transcript ?? "";
        } else {
          interim += result[0]?.transcript ?? "";
        }
      }
      if (final.trim()) {
        setInterimTranscript("");
        onResultRef.current?.(final.trim());
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // Recognition was already running - ignore.
    }
  }, [isListening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, interimTranscript, start, stop };
}
