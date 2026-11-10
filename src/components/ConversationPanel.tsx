'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { Bot, User, Volume2, Sparkles } from 'lucide-react';

interface ConversationPanelProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  onPlayMessage?: (text: string) => void;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  isProcessing,
  onPlayMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/5">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Welcome to the Interview Session
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Ask me about my engineering journey, background at Zensar and Turing, system projects like Conductor and Arkive AI, or how I approach building reliable AI systems.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <span>🎙️ Press the microphone to speak or type below</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
      {messages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                isUser
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                isUser
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[11px] font-medium opacity-70">
                  {isUser ? 'You' : 'Pranav'}
                </span>
                {!isUser && onPlayMessage && (
                  <button
                    onClick={() => onPlayMessage(message.content)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/70 text-slate-300 hover:text-white transition-opacity"
                    title="Play voice response"
                    aria-label="Play voice response"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        );
      })}

      {isProcessing && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-300 shadow-sm flex items-center gap-2">
            <div className="flex gap-1.5 py-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
            </div>
            <span className="text-xs text-slate-400 ml-1">Thinking...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

