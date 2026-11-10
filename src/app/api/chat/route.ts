import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema, ChatResponse, ChatErrorResponse } from '@/types/chat';
import { buildSystemInstruction } from '@/services/promptBuilder';
import { generateInterviewResponse, GeminiServiceError } from '@/services/geminiService';
import { checkRateLimit, getClientIp } from '@/services/rateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 30, 60);

    if (!rateLimit.success) {
      return NextResponse.json<ChatErrorResponse>(
        {
          error: `You've asked quite a few questions! Please pause for ${rateLimit.resetSeconds} seconds before asking the next one.`,
          code: 'RATE_LIMIT',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
          },
        }
      );
    }

    // 2. Parse & Validate Request Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<ChatErrorResponse>(
        { error: 'Invalid JSON request format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const validationResult = ChatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Invalid request parameters';
      return NextResponse.json<ChatErrorResponse>(
        { error: firstError, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { message, history } = validationResult.data;

    // 3. Construct System Instruction with Knowledge Base
    let systemInstruction: string;
    try {
      systemInstruction = buildSystemInstruction();
    } catch (err: any) {
      console.error('[API/chat] Failed to load knowledge base:', err);
      return NextResponse.json<ChatErrorResponse>(
        {
          error: 'Knowledge base failed to initialize on the server.',
          code: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    // 4. Call Gemini Service
    const answer = await generateInterviewResponse({
      message,
      history,
      systemInstruction,
    });

    return NextResponse.json<ChatResponse>(
      { answer },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error: any) {
    console.error('[API/chat] Handler error:', error);

    if (error instanceof GeminiServiceError) {
      const statusCode = error.code === 'CONFIG_ERROR' ? 503 : error.code === 'RATE_LIMIT' ? 429 : 500;
      return NextResponse.json<ChatErrorResponse>(
        { error: error.message, code: error.code },
        { status: statusCode }
      );
    }

    return NextResponse.json<ChatErrorResponse>(
      {
        error: 'Unable to generate response at this time. Please try again.',
        code: 'PROVIDER_ERROR',
      },
      { status: 500 }
    );
  }
}
