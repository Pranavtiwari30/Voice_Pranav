'use client';

import React from 'react';
import { VoiceState } from '@/types/chat';

interface StatusIndicatorProps {
  state: VoiceState;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ state }) => {
  const getStatusConfig = () => {
    switch (state) {
      case 'listening':
        return {
          dotColor: 'bg-amber-400',
          pulseColor: 'bg-amber-400/40',
          label: 'Listening',
          textColor: 'text-amber-300',
        };
      case 'processing':
        return {
          dotColor: 'bg-indigo-400',
          pulseColor: 'bg-indigo-400/40',
          label: 'Thinking...',
          textColor: 'text-indigo-300',
        };
      case 'speaking':
        return {
          dotColor: 'bg-emerald-400',
          pulseColor: 'bg-emerald-400/40',
          label: 'Speaking',
          textColor: 'text-emerald-300',
        };
      case 'error':
        return {
          dotColor: 'bg-rose-500',
          pulseColor: 'bg-rose-500/40',
          label: 'Error',
          textColor: 'text-rose-300',
        };
      case 'idle':
      default:
        return {
          dotColor: 'bg-emerald-500',
          pulseColor: 'bg-emerald-500/30',
          label: 'Ready',
          textColor: 'text-slate-300',
        };
    }
  };

  const { dotColor, pulseColor, label, textColor } = getStatusConfig();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-sm backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`} />
      </span>
      <span className={`text-xs font-medium tracking-wide ${textColor}`}>{label}</span>
    </div>
  );
};

