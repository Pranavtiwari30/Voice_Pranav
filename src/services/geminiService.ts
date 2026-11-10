import { GoogleGenAI } from '@google/genai';
import { HistoryMessageSchema } from '../types/chat';
import { z } from 'zod';

export interface GenerateOptions {
  message: string;
  history?: Array<z.infer<typeof HistoryMessageSchema>>;
  systemInstruction: string;
}

export class GeminiServiceError extends Error {
  code: 'CONFIG_ERROR' | 'RATE_LIMIT' | 'PROVIDER_ERROR';

  constructor(message: string, code: 'CONFIG_ERROR' | 'RATE_LIMIT' | 'PROVIDER_ERROR') {
    super(message);
    this.name = 'GeminiServiceError';
    this.code = code;
  }
}

let genAIClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiServiceError(
      'Server configuration error: GEMINI_API_KEY is not set on the server.',
      'CONFIG_ERROR'
    );
  }

  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }

  return genAIClient;
}

function cleanSpokenText(text: string): string {
  return text
    // Remove bold / italic markers
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove markdown headers
    .replace(/^#+\s+/gm, '')
    // Remove markdown list bullets
    .replace(/^[\*\-\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove inline backticks
    .replace(/`([^`]+)`/g, '$1')
    // Normalize multiple spaces and newlines
    .replace(/\n\s*\n/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: any): boolean {
  const msg = (error?.message || String(error)).toLowerCase();
  const status = error?.status || error?.code;
  return (
    status === 503 ||
    status === 'UNAVAILABLE' ||
    msg.includes('503') ||
    msg.includes('high demand') ||
    msg.includes('unavailable') ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit')
  );
}

export async function generateInterviewResponse(options: GenerateOptions): Promise<string> {
  const ai = getClient();
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';

  const { message, history = [], systemInstruction } = options;

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: turn.content }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  let lastError: any = null;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      });

      const rawText = response.text || '';
      if (!rawText.trim()) {
        throw new GeminiServiceError(
          'Gemini returned an empty response. Please try asking again.',
          'PROVIDER_ERROR'
        );
      }

      return cleanSpokenText(rawText);
    } catch (error: any) {
      lastError = error;
      if (error instanceof GeminiServiceError) {
        throw error;
      }

      const isRetryable = isRetryableError(error);
      console.warn(
        `[GeminiService] Model ${modelName} attempt ${attempt}/${maxAttempts} failed:`,
        error?.message || error
      );

      if (isRetryable && attempt < maxAttempts) {
        // Exponential backoff: 1000ms, 2000ms, 3000ms
        await delay(1000 * attempt);
        continue;
      }

      // If error is not retryable, stop retrying immediately
      break;
    }
  }

  // If retries failed, parse the final error
  const finalErrorMsg = lastError?.message || String(lastError);
  console.error('[GeminiService] Generation failed:', finalErrorMsg);

  if (isRetryableError(lastError)) {
    throw new GeminiServiceError(
      'The AI service is currently experiencing high demand. Please wait a few seconds and try again.',
      'RATE_LIMIT'
    );
  }

  if (finalErrorMsg.includes('API_KEY_INVALID') || finalErrorMsg.includes('API key not valid')) {
    throw new GeminiServiceError(
      'Server configuration error: Invalid GEMINI_API_KEY configured.',
      'CONFIG_ERROR'
    );
  }

  throw new GeminiServiceError(
    'An unexpected issue occurred while generating the response. Please try again.',
    'PROVIDER_ERROR'
  );
}

