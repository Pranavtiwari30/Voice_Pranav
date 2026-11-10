'use client';

import React from 'react';

interface AudioWaveformProps {
  state: 'listening' | 'speaking' | 'idle';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ state }) => {
  if (state === 'idle') return null;

  const isListening = state === 'listening';
  const barColor = isListening ? 'bg-amber-400' : 'bg-blue-400';
  const glowColor = isListening ? 'shadow-amber-400/50' : 'shadow-blue-400/50';

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/60">
      <span className="text-xs font-medium mr-2 text-slate-300">
        {isListening ? 'Listening...' : 'Speaking...'}
      </span>
      <div className={`w-1 rounded-full animate-soundwave-1 ${barColor} shadow-sm ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-2 ${barColor} shadow-sm ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-3 ${barColor} shadow-sm ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-4 ${barColor} shadow-sm ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-5 ${barColor} shadow-sm ${glowColor}`} />
    </div>
  );
};

