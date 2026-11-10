'use client';

import React, { useState, useRef } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TextComposer: React.FC<TextComposerProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Or type a question for Pranav (e.g. What is your engineering philosophy?)...',
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
      className="relative flex items-center w-full max-w-2xl mx-auto group"
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
        className="w-full pl-4 pr-20 py-3 bg-card/70 hover:bg-card/90 focus:bg-card text-foreground placeholder:text-muted-foreground/70 rounded-2xl border border-border/80 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-xs sm:text-sm shadow-sm disabled:opacity-50 backdrop-blur-md"
      />
      <div className="absolute right-2 flex items-center gap-1.5">
        {input.trim() && (
          <span className="hidden sm:inline-flex items-center text-[10px] text-muted-foreground mr-0.5">
            Press <CornerDownLeft className="size-2.5 mx-0.5" />
          </span>
        )}
        <Button
          type="submit"
          size="icon-sm"
          disabled={disabled || !input.trim()}
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs size-7"
          aria-label="Send question"
        >
          <Send className="size-3.5" />
        </Button>
      </div>
    </form>
  );
};
