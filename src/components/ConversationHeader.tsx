'use client';

import React from 'react';
import { VoiceState } from '@/types/chat';
import { StatusIndicator } from './StatusIndicator';
import { Trash2, Mic, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ConversationHeaderProps {
  state: VoiceState;
  onClearConversation: () => void;
  messageCount: number;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  state,
  onClearConversation,
  messageCount,
}) => {
  return (
    <header className="border-b border-border/70 bg-card/70 backdrop-blur-md sticky top-0 z-20 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-foreground/70 flex items-center justify-center text-primary-foreground font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center border border-border shadow-xs">
              <Mic className="w-2.5 h-2.5 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                Pranav Tiwari
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-sm">
                Voice AI
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              AI Engineer & Systems Builder • Conversational Interview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <StatusIndicator state={state} />

          {messageCount > 0 && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={onClearConversation}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-lg"
                    aria-label="Reset conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                }
              />
              <TooltipContent>Start a new conversation</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
};
