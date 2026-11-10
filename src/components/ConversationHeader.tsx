'use client';

import React from 'react';
import { VoiceState } from '@/types/chat';
import { StatusIndicator } from './StatusIndicator';
import { Trash2, Mic, Bot } from 'lucide-react';

interface ConversationHeaderProps {
  state: VoiceState;
  onClearConversation: () => void;
  messageCount: number;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  state,
  onClearConversation,
  messageCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
              <Mic className="w-2.5 h-2.5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                Pranav Tiwari
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Voice AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI Engineer & Systems Builder • Conversational Interview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <StatusIndicator state={state} />

          {messageCount > 0 && (
            <button
              onClick={onClearConversation}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-transparent hover:border-slate-700"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

