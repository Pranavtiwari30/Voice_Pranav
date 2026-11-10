'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const QUESTIONS = [
  'Tell me about your journey.',
  'What would you say is your biggest superpower?',
  'What are three areas you want to improve?',
  'What is something people misunderstand about working with you?',
  'Tell me about a time you pushed beyond your comfort zone.',
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  disabled = false,
}) => {
  return (
    <div className="py-1">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Suggested Topics
        </span>
      </div>
      <Suggestions className="pb-1">
        {QUESTIONS.map((question, idx) => (
          <Suggestion
            key={idx}
            suggestion={question}
            onClick={onSelectQuestion}
            disabled={disabled}
            variant="outline"
            className="text-xs font-normal border-border/80 bg-card/60 hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
          >
            <span className="text-primary font-semibold mr-1.5">“</span>
            {question}
            <span className="text-primary font-semibold ml-1">”</span>
          </Suggestion>
        ))}
      </Suggestions>
    </div>
  );
};
