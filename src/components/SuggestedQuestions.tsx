'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

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
    <div className="py-2">
      <div className="flex items-center gap-1.5 mb-2.5 px-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Suggested Topics
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(question)}
            disabled={disabled}
            className="text-left text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-[0.98] border border-slate-700/60 hover:border-blue-500/40 text-slate-200 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:pointer-events-none group"
          >
            <span className="text-blue-400 group-hover:text-blue-300 mr-1.5">“</span>
            {question}
            <span className="text-blue-400 group-hover:text-blue-300 ml-1">”</span>
          </button>
        ))}
      </div>
    </div>
  );
};
