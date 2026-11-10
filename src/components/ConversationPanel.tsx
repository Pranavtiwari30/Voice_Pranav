'use client';

import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Bot, User, Volume2, Sparkles } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
      <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="Interview Session with Pranav"
            description="Ask me about my engineering journey, background at Zensar and Turing, system projects like Conductor and Arkive AI, or how I approach building reliable AI systems."
            icon={
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-1 text-primary shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
            }
          />
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
                <Avatar size="sm" className="shrink-0 mt-0.5">
                  <AvatarFallback
                    className={
                      isUser
                        ? 'bg-secondary text-secondary-foreground font-semibold'
                        : 'bg-primary text-primary-foreground font-semibold'
                    }
                  >
                    {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                  </AvatarFallback>
                </Avatar>

                <Message from={isUser ? 'user' : 'assistant'} className="max-w-[85%] sm:max-w-[75%]">
                  <MessageContent
                    className={
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-3 shadow-xs'
                        : 'bg-card text-card-foreground border border-border/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs'
                    }
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-70">
                      <span>{isUser ? 'You' : 'Pranav'}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

                    {!isUser && onPlayMessage && (
                      <MessageActions className="justify-end mt-1">
                        <MessageAction
                          onClick={() => onPlayMessage(message.content)}
                          tooltip="Play voice response"
                          label="Play voice response"
                          className="text-muted-foreground hover:text-foreground h-6 w-6"
                        >
                          <Volume2 className="size-3.5" />
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
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card text-card-foreground border border-border/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs max-w-sm">
              <div className="flex items-center gap-2">
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
