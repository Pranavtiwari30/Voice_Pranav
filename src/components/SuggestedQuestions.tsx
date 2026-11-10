'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const TOPICS = [
  { icon: '🚀', text: 'Tell me about your journey from Lucknow to AI.' },
  { icon: '⚡', text: 'What is your biggest engineering superpower?' },
  { icon: '🛠️', text: 'How did you build Conductor to handle 71k claims/sec?' },
  { icon: '🛡️', text: 'How does Arkive AI keep RAG compliant in production?' },
  { icon: '🤝', text: 'What is something people misunderstand about working with you?' },
  { icon: '🎯', text: 'What are three areas you actively want to improve?' },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  disabled = false,
}) => {
  return (
    <div className="py-0.5">
      <div className="flex items-center justify-between gap-1.5 mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Suggested Interview Topics
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground hidden sm:inline">Click to ask aloud</span>
      </div>
      <Suggestions className="pb-1 gap-2">
        {TOPICS.map((topic, idx) => (
          <Suggestion
            key={idx}
            suggestion={topic.text}
            onClick={onSelectQuestion}
            disabled={disabled}
            variant="outline"
            className="text-xs font-normal border-border/70 bg-card/70 hover:bg-primary/10 hover:border-primary/40 hover:text-foreground transition-all cursor-pointer rounded-full px-3 py-1.5 shadow-2xs backdrop-blur-sm"
          >
            <span className="mr-1.5 text-sm">{topic.icon}</span>
            <span>{topic.text}</span>
          </Suggestion>
        ))}
      </Suggestions>
    </div>
  );
};
