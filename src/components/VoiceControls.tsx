'use client';

import React from 'react';
import { Mic, MicOff, Volume2, Square, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { VoiceState } from '@/types/chat';
import { AudioWaveform } from './AudioWaveform';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface VoiceControlsProps {
  state: VoiceState;
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  hasCheckedSupport?: boolean;
  interimTranscript: string;
  hasContentToReplay: boolean;
  permissionError: string | null;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
  onReplay: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  state,
  isListening,
  isSpeaking,
  isSupported,
  hasCheckedSupport = false,
  interimTranscript,
  hasContentToReplay,
  permissionError,
  onToggleListening,
  onStopSpeaking,
  onReplay,
}) => {
  return (
    <div className="flex flex-col items-center gap-3.5 w-full">
      {/* Microphone Permission Warning / Unsupported Browser Notice */}
      {permissionError && (
        <Alert variant="destructive" className="w-full max-w-xl rounded-2xl">
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs font-semibold">Microphone Notice</AlertTitle>
          <AlertDescription className="text-xs mt-0.5">
            {permissionError}
          </AlertDescription>
        </Alert>
      )}

      {!isSupported && hasCheckedSupport && !permissionError && (
        <Alert className="w-full max-w-xl rounded-2xl border-border/80 bg-card/80 backdrop-blur-md">
          <AlertCircle className="size-4 text-primary" />
          <AlertTitle className="text-xs font-semibold">Voice Input Notice</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground mt-0.5">
            Speech recognition isn't natively available in this browser. You can ask questions using the input box below, and Pranav's answers will be read aloud!
          </AlertDescription>
        </Alert>
      )}

      {/* Interim live speech recognition readout */}
      {isListening && interimTranscript && (
        <div className="w-full max-w-xl px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm shadow-md flex items-center gap-2.5 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <p className="italic font-medium tracking-wide truncate">{interimTranscript}</p>
        </div>
      )}

      {/* Audio Waveform status badge */}
      {(isListening || isSpeaking) && (
        <AudioWaveform state={isListening ? 'listening' : 'speaking'} />
      )}

      {/* Primary Voice Action Center */}
      <div className="relative flex items-center justify-center gap-4 py-1">
        {/* Replay Button (Left) */}
        {hasContentToReplay && !isSpeaking && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={onReplay}
                  disabled={state === 'processing' || isListening}
                  variant="outline"
                  size="icon"
                  className="rounded-full size-11 border-border/70 bg-card/80 hover:bg-muted text-foreground transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  aria-label="Replay last answer"
                >
                  <RotateCcw className="size-4 text-muted-foreground hover:text-foreground" />
                </Button>
              }
            />
            <TooltipContent>Replay last response</TooltipContent>
          </Tooltip>
        )}

        {/* Central Glowing Mic / Control Sphere */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ambient Pulse Rings when Active */}
          {isListening && (
            <>
              <div className="absolute inset-0 -m-4 rounded-full bg-amber-500/20 animate-pulse-ring pointer-events-none" />
              <div className="absolute inset-0 -m-2 rounded-full bg-amber-500/30 animate-ping pointer-events-none" />
            </>
          )}

          {isSpeaking ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={onStopSpeaking}
                variant="destructive"
                className="px-6 py-5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg shadow-destructive/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Stop speaking"
              >
                <Square className="size-3.5 fill-current" />
                <span>Pause Audio</span>
              </Button>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      onClick={onReplay}
                      variant="outline"
                      size="icon"
                      className="rounded-full size-11 border-border/80 bg-card/80 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      aria-label="Restart playback"
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  }
                />
                <TooltipContent>Replay from beginning</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={onToggleListening}
                    disabled={!isSupported || state === 'processing'}
                    className={`relative p-5 rounded-full font-medium transition-all shadow-xl active:scale-90 disabled:opacity-40 disabled:pointer-events-none cursor-pointer group ${
                      isListening
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/40 ring-4 ring-amber-400/30 scale-105'
                        : 'bg-gradient-to-tr from-primary via-indigo-600 to-indigo-500 text-white shadow-primary/30 hover:shadow-primary/50 hover:scale-105'
                    }`}
                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? (
                      <MicOff className="size-7" />
                    ) : (
                      <Mic className="size-7 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                }
              />
              <TooltipContent side="top">
                {isListening ? 'Click to stop listening' : 'Click to speak with Pranav'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Voice Status Subtitle */}
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground tracking-wide">
          {isListening
            ? '🎙️ Listening to your question... Click to finish'
            : isSpeaking
            ? '🔊 Pranav is speaking... Tap Pause anytime'
            : state === 'processing'
            ? '✨ Formulating answer...'
            : 'Tap the mic to talk, or choose a topic below'}
        </p>
      </div>
    </div>
  );
};
