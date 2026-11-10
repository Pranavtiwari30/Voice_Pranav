'use client';

import React from 'react';
import { Mic, MicOff, Volume2, Square, RotateCcw, AlertCircle } from 'lucide-react';
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
  interimTranscript,
  hasContentToReplay,
  permissionError,
  onToggleListening,
  onStopSpeaking,
  onReplay,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Microphone Permission Warning / Unsupported Browser Notice */}
      {permissionError && (
        <Alert variant="destructive" className="w-full max-w-xl rounded-xl">
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs font-semibold">Microphone Notice</AlertTitle>
          <AlertDescription className="text-xs">
            {permissionError}
          </AlertDescription>
        </Alert>
      )}

      {!isSupported && !permissionError && (
        <Alert className="w-full max-w-xl rounded-xl border-border bg-card">
          <AlertCircle className="size-4 text-primary" />
          <AlertTitle className="text-xs font-semibold">Voice Input Notice</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Speech recognition isn't natively available in this browser. You can still ask any question using the text box below, and Pranav's answers will be read aloud!
          </AlertDescription>
        </Alert>
      )}

      {/* Interim live speech recognition readout */}
      {isListening && interimTranscript && (
        <div className="w-full max-w-xl px-4 py-2.5 rounded-xl bg-card border border-amber-500/40 text-amber-300 text-sm shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <p className="italic font-mono truncate">{interimTranscript}</p>
        </div>
      )}

      {/* Audio Waveform status badge */}
      {(isListening || isSpeaking) && (
        <AudioWaveform state={isListening ? 'listening' : 'speaking'} />
      )}

      {/* Voice Action Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {/* Replay Button */}
        {hasContentToReplay && !isSpeaking && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={onReplay}
                  disabled={state === 'processing' || isListening}
                  variant="outline"
                  size="icon"
                  className="rounded-full size-11 border-border/80 bg-card hover:bg-accent text-foreground transition-all cursor-pointer shadow-xs"
                  aria-label="Replay last answer"
                >
                  <RotateCcw className="size-4" />
                </Button>
              }
            />
            <TooltipContent>Replay last answer</TooltipContent>
          </Tooltip>
        )}

        {/* Primary Microphone / Stop Button */}
        {isSpeaking ? (
          <Button
            onClick={onStopSpeaking}
            variant="destructive"
            className="px-6 py-5 rounded-full text-sm font-medium flex items-center gap-2 shadow-md cursor-pointer transition-all"
            aria-label="Stop speaking"
          >
            <Square className="size-4 fill-current" />
            <span>Stop Speaking</span>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={onToggleListening}
                  disabled={!isSupported || state === 'processing'}
                  className={`relative p-5 rounded-full font-medium transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                    isListening
                      ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/30 ring-4 ring-amber-400/30 animate-pulse'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                  }`}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? (
                    <MicOff className="size-7" />
                  ) : (
                    <Mic className="size-7" />
                  )}
                </button>
              }
            />
            <TooltipContent>
              {isListening ? 'Stop listening' : 'Click to talk via microphone'}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Active playback icon control */}
        {isSpeaking && (
          <Button
            onClick={onReplay}
            variant="outline"
            size="icon"
            className="rounded-full size-11 border-border/80 bg-card hover:bg-accent text-emerald-400 transition-all cursor-pointer shadow-xs"
            aria-label="Restart playback"
          >
            <Volume2 className="size-4" />
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {isListening
            ? 'Listening to you... Click the mic or pause speaking when done'
            : isSpeaking
            ? 'Pranav is speaking... Click Stop to interrupt'
            : state === 'processing'
            ? 'Thinking of the answer...'
            : 'Click the microphone or choose a topic to ask'}
        </p>
      </div>
    </div>
  );
};
