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

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

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
  const configuredModel = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  // Build candidate model list (primary model first, then fallbacks without duplicates)
  const candidateModels = [
    configuredModel,
    ...FALLBACK_MODELS.filter((m) => m !== configuredModel),
  ];

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

  // Try candidate models in order if one experiences high demand (503)
  for (const modelName of candidateModels) {
    const maxAttempts = 3;

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
          // Exponential backoff: 800ms, 1600ms
          await delay(800 * attempt);
          continue;
        }

        // If not retryable or max attempts exhausted, break to try the next fallback model
        break;
      }
    }
  }

  // If all models and retries failed, parse the final error
  const finalErrorMsg = lastError?.message || String(lastError);
  console.error('[GeminiService] All model attempts failed:', finalErrorMsg);

  if (isRetryableError(lastError)) {
    throw new GeminiServiceError(
      'Gemini is currently experiencing high demand. Please try again in a few moments.',
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

