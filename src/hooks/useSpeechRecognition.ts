'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onTranscriptReady: (transcript: string) => void;
  onError?: (errorMessage: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  interimTranscript: string;
  isSupported: boolean;
  hasCheckedSupport: boolean;
  permissionError: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition({
  onTranscriptReady,
  onError,
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [hasCheckedSupport, setHasCheckedSupport] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const fullTranscriptRef = useRef<string>('');
  const isExplicitStopRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SpeechRecognition support check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
      setHasCheckedSupport(true);
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const finishSpeech = useCallback(() => {
    clearSilenceTimer();
    const finalTranscript = fullTranscriptRef.current.trim();
    setIsListening(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored if already stopped
      }
    }

    if (finalTranscript) {
      onTranscriptReady(finalTranscript);
      fullTranscriptRef.current = '';
    }
  }, [clearSilenceTimer, onTranscriptReady]);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const err = 'Speech recognition is not supported in this browser. You can type your questions below!';
      setPermissionError(err);
      onError?.(err);
      return;
    }

    setPermissionError(null);
    setInterimTranscript('');
    fullTranscriptRef.current = '';
    isExplicitStopRef.current = false;
    clearSilenceTimer();

    try {
      // Abort any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      (recognition as any).maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptSegment = result[0].transcript;

          if (result.isFinal) {
            fullTranscriptRef.current += (fullTranscriptRef.current ? ' ' : '') + transcriptSegment.trim();
          } else {
            currentInterim += transcriptSegment;
          }
        }

        setInterimTranscript(currentInterim || fullTranscriptRef.current);

        // Reset silence timer: automatically conclude if user pauses for 2 seconds after speaking
        clearSilenceTimer();
        if (fullTranscriptRef.current.trim() || currentInterim.trim()) {
          silenceTimerRef.current = setTimeout(() => {
            finishSpeech();
          }, 2200);
        }
      };

      recognition.onerror = (event: any) => {
        clearSilenceTimer();
        const error = event.error;

        if (error === 'no-speech') {
          // Normal if user clicks mic and doesn't speak immediately
          return;
        }

        if (error === 'not-allowed' || error === 'service-not-allowed') {
          const msg = 'Microphone permission was denied. Please enable microphone access in your browser settings or type your message below.';
          setPermissionError(msg);
          onError?.(msg);
          setIsListening(false);
          return;
        }

        if (error === 'network') {
          const msg = 'Network error occurred during speech recognition. Please check your connection or use text input.';
          setPermissionError(msg);
          onError?.(msg);
          setIsListening(false);
          return;
        }

        if (error !== 'aborted') {
          console.warn('[SpeechRecognition] error:', error);
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        setIsListening(false);

        // If stopped naturally and transcript exists, emit it
        if (!isExplicitStopRef.current && fullTranscriptRef.current.trim()) {
          const text = fullTranscriptRef.current.trim();
          fullTranscriptRef.current = '';
          setInterimTranscript('');
          onTranscriptReady(text);
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('[SpeechRecognition] start error:', err);
      const msg = 'Could not start microphone. You can type your question in the text box below.';
      setPermissionError(msg);
      onError?.(msg);
      setIsListening(false);
    }
  }, [clearSilenceTimer, finishSpeech, onError, onTranscriptReady]);

  const stopListening = useCallback(() => {
    isExplicitStopRef.current = true;
    finishSpeech();
  }, [finishSpeech]);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    fullTranscriptRef.current = '';
    clearSilenceTimer();
  }, [clearSilenceTimer]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [clearSilenceTimer]);

  return {
    isListening,
    interimTranscript,
    isSupported,
    hasCheckedSupport,
    permissionError,
    startListening,
    stopListening,
    resetTranscript,
  };
}

