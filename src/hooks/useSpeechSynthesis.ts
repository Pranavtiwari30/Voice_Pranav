'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  replay: () => void;
  hasContentToReplay: boolean;
  selectedVoiceName: string | null;
}

export function useSpeechSynthesis(onEndCallback?: () => void): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null);

  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pick the most natural-sounding English voice available
  const chooseVoice = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const voices = window.speechSynthesis.getVoices();
    voicesRef.current = voices;

    if (!voices || voices.length === 0) return;

    // Prefer natural / high-quality English voices
    const preferredVoices = [
      // Natural voices (Chrome / Edge / Safari / macOS)
      (v: SpeechSynthesisVoice) => v.name.includes('Natural') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Google') && v.lang.startsWith('en-US'),
      (v: SpeechSynthesisVoice) => v.name.includes('Samantha') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Daniel') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.name.includes('Alex') && v.lang.startsWith('en'),
      (v: SpeechSynthesisVoice) => v.lang === 'en-US',
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
    ];

    let chosen: SpeechSynthesisVoice | null = null;
    for (const matcher of preferredVoices) {
      const match = voices.find(matcher);
      if (match) {
        chosen = match;
        break;
      }
    }

    if (!chosen && voices.length > 0) {
      chosen = voices[0];
    }

    if (chosen) {
      selectedVoiceRef.current = chosen;
      setSelectedVoiceName(chosen.name);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      chooseVoice();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = chooseVoice;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [chooseVoice]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Stop any ongoing speech to prevent overlapping
      window.speechSynthesis.cancel();

      const trimmed = text.trim();
      if (!trimmed) return;

      setLastSpokenText(trimmed);

      // Clean out punctuation or markdown that might disrupt TTS
      const cleanText = trimmed
        .replace(/[*_#`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      utterance.rate = 1.02; // Natural conversational tempo
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) {
          onEndCallback();
        }
      };

      utterance.onerror = (e) => {
        // 'interrupted' is normal when canceled
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[SpeechSynthesis] Error:', e.error);
        }
        setIsSpeaking(false);
      };

      // Workaround for Chrome bug where long utterances freeze: resume synthesis if paused
      window.speechSynthesis.speak(utterance);
    },
    [onEndCallback]
  );

  const replay = useCallback(() => {
    if (lastSpokenText) {
      speak(lastSpokenText);
    }
  }, [lastSpokenText, speak]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stopSpeaking,
    replay,
    hasContentToReplay: Boolean(lastSpokenText),
    selectedVoiceName,
  };
}

