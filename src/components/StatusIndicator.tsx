'use client';

import React from 'react';
import { VoiceState } from '@/types/chat';
import { Badge } from '@/components/ui/badge';

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
          badgeVariant: 'outline' as const,
          className: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
        };
      case 'processing':
        return {
          dotColor: 'bg-indigo-400',
          pulseColor: 'bg-indigo-400/40',
          label: 'Thinking...',
          badgeVariant: 'outline' as const,
          className: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
        };
      case 'speaking':
        return {
          dotColor: 'bg-emerald-400',
          pulseColor: 'bg-emerald-400/40',
          label: 'Speaking',
          badgeVariant: 'outline' as const,
          className: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
        };
      case 'error':
        return {
          dotColor: 'bg-destructive',
          pulseColor: 'bg-destructive/40',
          label: 'Error',
          badgeVariant: 'destructive' as const,
          className: '',
        };
      case 'idle':
      default:
        return {
          dotColor: 'bg-emerald-500',
          pulseColor: 'bg-emerald-500/30',
          label: 'Ready',
          badgeVariant: 'outline' as const,
          className: 'border-border/60 text-muted-foreground bg-muted/30',
        };
    }
  };

  const { dotColor, pulseColor, label, badgeVariant, className } = getStatusConfig();

  return (
    <Badge
      variant={badgeVariant}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span>{label}</span>
    </Badge>
  );
};
