'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ChatMessage, VoiceState, Role } from '@/types/chat';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { ConversationHeader } from './ConversationHeader';
import { ConversationPanel } from './ConversationPanel';
import { VoiceControls } from './VoiceControls';
import { TextComposer } from './TextComposer';
import { SuggestedQuestions } from './SuggestedQuestions';
import { AlertCircle, X } from 'lucide-react';

export const InterviewApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<VoiceState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reference to current messages for asynchronous speech callbacks
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  // Speech Synthesis hook
  const {
    isSpeaking,
    isSupported: isTtsSupported,
    speak,
    stopSpeaking: ttsStopSpeaking,
    replay,
    hasContentToReplay,
  } = useSpeechSynthesis(() => {
    // When TTS finishes speaking naturally
    setState((prev) => (prev === 'speaking' ? 'idle' : prev));
  });

  const stopSpeaking = useCallback(() => {
    ttsStopSpeaking();
    setState((prev) => (prev === 'speaking' ? 'idle' : prev));
  }, [ttsStopSpeaking]);

  // Main Chat Pipeline: handles sending message to /api/chat
  const handleSendMessage = useCallback(
    async (messageText: string) => {
      const text = messageText.trim();
      if (!text) return;

      // 1. Interrupt any current speech
      stopSpeaking();
      setErrorMessage(null);

      // 2. Append User Message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      const updatedHistory = [...messagesRef.current, userMessage];
      setMessages(updatedHistory);
      setState('processing');

      try {
        // Prepare bounded history for backend (max 10 recent messages)
        const recentHistory = updatedHistory.slice(-10).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            history: recentHistory.slice(0, -1), // history before current message
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate response. Please try again.');
        }

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          role: 'assistant',
          content: data.answer,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Speak the answer aloud
        setState('speaking');
        speak(data.answer);
      } catch (err: any) {
        console.error('[InterviewApp] Error communicating with API:', err);
        const errMsg = err?.message || 'A network error occurred. Please try again.';
        setErrorMessage(errMsg);
        setState('error');
      }
    },
    [speak, stopSpeaking]
  );

  // Speech Recognition hook
  const {
    isListening,
    interimTranscript,
    isSupported: isSttSupported,
    permissionError,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscriptReady: (transcript: string) => {
      handleSendMessage(transcript);
    },
    onError: (err: string) => {
      setErrorMessage(err);
      setState('error');
    },
  });

  // Toggle Listening: ensure speaking is stopped first
  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setState('idle');
    } else {
      stopSpeaking();
      setErrorMessage(null);
      setState('listening');
      startListening();
    }
  }, [isListening, startListening, stopListening, stopSpeaking]);

  const handleClearConversation = useCallback(() => {
    stopSpeaking();
    if (isListening) {
      stopListening();
    }
    setMessages([]);
    setErrorMessage(null);
    setState('idle');
  }, [isListening, stopListening, stopSpeaking]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <ConversationHeader
        state={state}
        onClearConversation={handleClearConversation}
        messageCount={messages.length}
      />

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="mx-4 mt-3 max-w-3xl self-center w-full">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm flex items-start justify-between gap-3 shadow-md">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded hover:bg-rose-500/20 text-rose-300 hover:text-white transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Conversation Feed */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl w-full mx-auto">
        <ConversationPanel
          messages={messages}
          isProcessing={state === 'processing'}
          onPlayMessage={(text) => {
            stopSpeaking();
            setState('speaking');
            speak(text);
          }}
        />

        {/* Footer Interaction Dock */}
        <section className="border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md p-4 sm:p-6 space-y-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Suggested Starter Questions */}
            {messages.length < 3 && (
              <SuggestedQuestions
                onSelectQuestion={(q) => handleSendMessage(q)}
                disabled={state === 'processing' || isListening}
              />
            )}

            {/* Voice Controls (Mic Button, Status, Replay) */}
            <VoiceControls
              state={state}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isSupported={isSttSupported}
              interimTranscript={interimTranscript}
              hasContentToReplay={hasContentToReplay}
              permissionError={permissionError}
              onToggleListening={handleToggleListening}
              onStopSpeaking={stopSpeaking}
              onReplay={() => {
                setState('speaking');
                replay();
              }}
            />

            {/* Text Input Fallback */}
            <TextComposer
              onSendMessage={handleSendMessage}
              disabled={state === 'processing' || isListening}
            />
          </div>
        </section>
      </main>
    </div>
  );
};
