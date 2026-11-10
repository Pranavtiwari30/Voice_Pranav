import { z } from 'zod';

export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message cannot exceed 1000 characters'),
  history: z.array(HistoryMessageSchema).max(20, 'History cannot exceed 20 messages').optional().default([]),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export interface ChatResponse {
  answer: string;
}

export interface ChatErrorResponse {
  error: string;
  code?: 'CONFIG_ERROR' | 'RATE_LIMIT' | 'VALIDATION_ERROR' | 'PROVIDER_ERROR';
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
