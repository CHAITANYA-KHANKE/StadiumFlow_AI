import { NextRequest, NextResponse } from 'next/server';
import { CopilotRequestSchema } from '@/lib/ai/schemas';
import { getAIEstimateReply } from '@/lib/ai/gemini';
import { rateLimit } from '@/lib/server/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = rateLimit(ip, 10, 60000);

    if (!rate.success) {
      return NextResponse.json(
        {
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: `Rate limit exceeded. Please try again in ${rate.resetSeconds} seconds.`
          }
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rate.resetSeconds)
          }
        }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const result = CopilotRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters.',
            fields: result.error.format()
          }
        },
        { status: 400 }
      );
    }

    const { message, history, language, userRole, stadiumState } = result.data;

    // Call Gemini API (with deterministic fallback internally if key is missing or calls fail)
    const replyData = await getAIEstimateReply(
      message,
      history,
      language,
      userRole,
      stadiumState
    );

    return NextResponse.json(replyData);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred during processing.'
        }
      },
      { status: 500 }
    );
  }
}
