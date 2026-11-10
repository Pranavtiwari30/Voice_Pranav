'use client';

import React from 'react';
import { Mic, MicOff, Volume2, Square, RotateCcw, AlertCircle } from 'lucide-react';
import { VoiceState } from '@/types/chat';
import { AudioWaveform } from './AudioWaveform';

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
        <div className="w-full max-w-xl p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-300">Voice Note</p>
            <p className="text-amber-200/90 mt-0.5">{permissionError}</p>
          </div>
        </div>
      )}

      {!isSupported && !permissionError && (
        <div className="w-full max-w-xl p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-slate-300">
            Speech recognition isn't natively available in this browser. You can still ask any question using the text box below, and Pranav's answers will be read aloud!
          </p>
        </div>
      )}

      {/* Interim live speech recognition readout */}
      {isListening && interimTranscript && (
        <div className="w-full max-w-xl px-4 py-2.5 rounded-xl bg-slate-800/90 border border-amber-500/30 text-amber-200 text-sm shadow-md animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
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
          <button
            onClick={onReplay}
            disabled={state === 'processing' || isListening}
            className="p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:pointer-events-none group"
            title="Replay last answer"
            aria-label="Replay last answer"
          >
            <RotateCcw className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
          </button>
        )}

        {/* Primary Microphone / Stop Button */}
        {isSpeaking ? (
          <button
            onClick={onStopSpeaking}
            className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-medium text-sm flex items-center gap-2.5 shadow-lg shadow-rose-600/30 transition-all border border-rose-400/40"
            title="Stop speaking"
            aria-label="Stop speaking"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop Speaking</span>
          </button>
        ) : (
          <button
            onClick={onToggleListening}
            disabled={!isSupported || state === 'processing'}
            className={`relative p-5 rounded-full font-medium text-white transition-all shadow-xl active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
              isListening
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/40 ring-4 ring-amber-400/30 animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-7 h-7 text-white" />
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </button>
        )}

        {/* Mute/Stop Speaking mini control if speaking is active */}
        {isSpeaking && (
          <button
            onClick={onReplay}
            className="p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm"
            title="Restart playback"
            aria-label="Restart playback"
          >
            <Volume2 className="w-5 h-5 text-emerald-400" />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400">
          {isListening
            ? 'Listening to you... Click the mic or pause speaking when done'
            : isSpeaking
            ? 'Pranav is speaking... Click Stop to interrupt'
            : state === 'processing'
            ? 'Thinking of the answer...'
            : 'Click the microphone or choose a question below'}
        </p>
      </div>
    </div>
  );
};
