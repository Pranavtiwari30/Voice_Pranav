'use client';

import React from 'react';

interface AudioWaveformProps {
  state: 'listening' | 'speaking' | 'idle';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ state }) => {
  if (state === 'idle') return null;

  const isListening = state === 'listening';
  const barColor = isListening ? 'bg-amber-400' : 'bg-emerald-400';
  const glowClass = isListening ? 'glow-listening border-amber-500/40 text-amber-300' : 'glow-speaking border-emerald-500/40 text-emerald-300';

  return (
    <div className={`flex items-center justify-center gap-2 h-10 px-4 py-1.5 rounded-full bg-card/90 backdrop-blur-xl border transition-all shadow-md ${glowClass}`}>
      <span className="w-2 h-2 rounded-full animate-ping shrink-0" style={{ backgroundColor: isListening ? '#FBBF24' : '#34D399' }} />
      <span className="text-xs font-semibold tracking-wide mr-1.5">
        {isListening ? 'Listening...' : 'Pranav speaking...'}
      </span>
      <div className="flex items-center gap-1 h-5">
        <div className={`w-1 rounded-full animate-soundwave-1 ${barColor}`} />
        <div className={`w-1 rounded-full animate-soundwave-2 ${barColor}`} />
        <div className={`w-1 rounded-full animate-soundwave-3 ${barColor}`} />
        <div className={`w-1 rounded-full animate-soundwave-4 ${barColor}`} />
        <div className={`w-1 rounded-full animate-soundwave-5 ${barColor}`} />
        <div className={`w-1 rounded-full animate-soundwave-2 ${barColor}`} />
        <div className={`w-1 rounded-full animate-soundwave-1 ${barColor}`} />
      </div>
    </div>
  );
};
