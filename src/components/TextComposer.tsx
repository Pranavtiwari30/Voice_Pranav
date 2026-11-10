'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface TextComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TextComposer: React.FC<TextComposerProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your question for Pranav...',
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-2xl mx-auto"
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={1000}
        className="w-full pl-4 pr-12 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-850 text-slate-100 placeholder-slate-400 rounded-2xl border border-slate-700/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm shadow-inner disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        title="Send question"
        aria-label="Send question"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
