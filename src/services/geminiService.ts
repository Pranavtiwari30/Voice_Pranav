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

export async function generateInterviewResponse(options: GenerateOptions): Promise<string> {
  const ai = getClient();
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';

  const { message, history = [], systemInstruction } = options;

  // Transform conversation history into Gemini format
  // Gemini expects roles: 'user' and 'model'
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
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    const errorMsg = error?.message || String(error);
    console.error('[GeminiService] Error calling Gemini API:', errorMsg);

    if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('rate limit')) {
      throw new GeminiServiceError(
        'The assistant is receiving high traffic right now. Please wait a few seconds and try again.',
        'RATE_LIMIT'
      );
    }

    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
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
}
