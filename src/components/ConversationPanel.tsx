'use client';

import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Bot, User, Volume2, Sparkles, Cpu, ShieldCheck, Zap, Mic } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Badge } from '@/components/ui/badge';

interface ConversationPanelProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  onPlayMessage?: (text: string) => void;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  isProcessing,
  onPlayMessage,
}) => {
  return (
    <Conversation className="flex-1 flex flex-col overflow-y-auto w-full">
      <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 px-4 max-w-xl mx-auto">
            {/* Glowing Voice AI Core Orb */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse pointer-events-none" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/30 via-indigo-500/20 to-emerald-500/20 p-[2px] shadow-xl">
                <div className="w-full h-full rounded-[22px] bg-card/90 backdrop-blur-xl flex items-center justify-center border border-white/10">
                  <div className="relative">
                    <Bot className="w-9 h-9 text-primary" />
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Intro Badge */}
            <Badge variant="outline" className="mb-3 px-3 py-1 rounded-full bg-primary/10 border-primary/25 text-primary text-xs font-medium tracking-wide">
              Conversational Voice Interview
            </Badge>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
              Interview Pranav Tiwari
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              Ask about my real engineering journey, background at <span className="text-foreground font-medium">Zensar</span> & <span className="text-foreground font-medium">Turing</span>, distributed systems like <span className="text-foreground font-medium">Conductor</span>, or how I build reliable AI.
            </p>

            {/* Core Capability Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-left">
              <div className="p-3 rounded-xl bg-card/50 border border-border/70 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="size-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">Conductor Engine</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  71,000 job claims/sec distributed orchestration with Zero-Downtime.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-card/50 border border-border/70 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">Arkive AI</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Production compliance RAG platform with real-time auditability.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-card/50 border border-border/70 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="size-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-semibold text-foreground">Enterprise AI</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Intern @ Zensar & multimodal LLM evaluation for Google via Turing.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <div
                key={message.id}
                className={`flex items-start gap-3 w-full ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar size="sm" className="shrink-0 mt-0.5 shadow-sm">
                  <AvatarFallback
                    className={
                      isUser
                        ? 'bg-secondary text-secondary-foreground font-semibold border border-border/50'
                        : 'bg-primary/20 text-primary font-semibold border border-primary/30'
                    }
                  >
                    {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                  </AvatarFallback>
                </Avatar>

                <Message from={isUser ? 'user' : 'assistant'} className="max-w-[85%] sm:max-w-[78%]">
                  <MessageContent
                    className={
                      isUser
                        ? 'bg-gradient-to-tr from-primary to-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-md border-0'
                        : 'bg-card/85 text-card-foreground border border-border/80 rounded-2xl rounded-tl-none px-4 py-3.5 shadow-sm backdrop-blur-md'
                    }
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75 font-medium">
                      <span>{isUser ? 'You' : 'Pranav Tiwari'}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

                    {!isUser && onPlayMessage && (
                      <MessageActions className="justify-end mt-2 pt-1.5 border-t border-border/40">
                        <MessageAction
                          onClick={() => onPlayMessage(message.content)}
                          tooltip="Replay voice audio"
                          label="Replay voice audio"
                          className="text-muted-foreground hover:text-foreground h-7 px-2 gap-1 rounded-lg hover:bg-muted/60 text-xs"
                        >
                          <Volume2 className="size-3.5 text-primary" />
                          <span className="text-[11px]">Listen</span>
                        </MessageAction>
                      </MessageActions>
                    )}
                  </MessageContent>
                </Message>
              </div>
            );
          })
        )}

        {isProcessing && (
          <div className="flex items-start gap-3 w-full">
            <Avatar size="sm" className="shrink-0 mt-0.5">
              <AvatarFallback className="bg-primary/20 text-primary border border-primary/30">
                <Bot className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card/85 text-card-foreground border border-border/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs max-w-sm backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
                <Shimmer className="text-xs text-muted-foreground font-medium">
                  Pranav is thinking...
                </Shimmer>
              </div>
            </div>
          </div>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};
