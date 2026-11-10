'use client';

import React from 'react';
import { VoiceState } from '@/types/chat';
import { StatusIndicator } from './StatusIndicator';
import { Trash2, Mic, Bot, Github, Linkedin, ExternalLink } from 'lucide-react';
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
    <header className="border-b border-border/60 bg-card/60 backdrop-blur-xl sticky top-0 z-30 px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Persona Profile */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-indigo-500 to-indigo-400 p-[1.5px] shadow-md shadow-primary/20">
              <div className="w-full h-full rounded-[14px] bg-card/90 flex items-center justify-center text-primary-foreground font-semibold">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card flex items-center justify-center border border-border/80 shadow-xs">
              <Mic className="w-2.5 h-2.5 text-primary" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-foreground tracking-tight truncate">
                Pranav Tiwari
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20">
                Voice AI
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate hidden xs:block">
              AI Engineer @ Zensar • Research @ IIT-K • Conversational Interview
            </p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <StatusIndicator state={state} />

          {/* Social Links */}
          <div className="hidden md:flex items-center gap-1 pl-1 border-l border-border/60">
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href="https://github.com/Pranavtiwari30"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center justify-center"
                    aria-label="GitHub Profile"
                  >
                    <Github className="size-4" />
                  </a>
                }
              />
              <TooltipContent>GitHub Profile</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href="https://linkedin.com/in/pranavtiwari3007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors inline-flex items-center justify-center"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="size-4" />
                  </a>
                }
              />
              <TooltipContent>LinkedIn Profile</TooltipContent>
            </Tooltip>
          </div>

          {/* Clear Session */}
          {messageCount > 0 && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={onClearConversation}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-xl hover:bg-muted/60"
                    aria-label="Reset conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:mr-1" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                }
              />
              <TooltipContent>Start fresh conversation</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
};
