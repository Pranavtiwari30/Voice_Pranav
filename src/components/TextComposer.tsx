'use client';

import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        className="w-full pl-4 pr-12 py-3 bg-card/80 hover:bg-card focus:bg-card text-foreground placeholder:text-muted-foreground rounded-2xl border border-border/80 focus:border-primary focus:ring-1 focus:ring-ring focus:outline-none transition-all text-sm shadow-xs disabled:opacity-50"
      />
      <Button
        type="submit"
        size="icon-sm"
        disabled={disabled || !input.trim()}
        className="absolute right-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        aria-label="Send question"
      >
        <Send className="size-3.5" />
      </Button>
    </form>
  );
};
