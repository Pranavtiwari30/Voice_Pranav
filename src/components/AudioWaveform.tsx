'use client';

import React from 'react';

interface AudioWaveformProps {
  state: 'listening' | 'speaking' | 'idle';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ state }) => {
  if (state === 'idle') return null;

  const isListening = state === 'listening';
  const barColor = isListening ? 'bg-amber-400' : 'bg-primary';
  const glowColor = isListening ? 'shadow-amber-400/50' : 'shadow-primary/50';

  return (
    <div className="flex items-center justify-center gap-1.5 h-9 px-4 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-xs">
      <span className="text-xs font-medium mr-2 text-muted-foreground">
        {isListening ? 'Listening...' : 'Speaking...'}
      </span>
      <div className={`w-1 rounded-full animate-soundwave-1 ${barColor} shadow-xs ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-2 ${barColor} shadow-xs ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-3 ${barColor} shadow-xs ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-4 ${barColor} shadow-xs ${glowColor}`} />
      <div className={`w-1 rounded-full animate-soundwave-5 ${barColor} shadow-xs ${glowColor}`} />
    </div>
  );
};
