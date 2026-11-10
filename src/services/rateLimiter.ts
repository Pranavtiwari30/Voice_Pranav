interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetAt) {
      ipRequestMap.delete(ip);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and records rate limits for a given IP.
 * @param ip Client IP address
 * @param limit Max requests allowed in the time window (default 30)
 * @param windowSeconds Time window in seconds (default 60s)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 30,
  windowSeconds: number = 60
): RateLimitResult {
  cleanupExpired();

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = ipRequestMap.get(ip);

  if (!existing || now > existing.resetAt) {
    ipRequestMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (existing.count >= limit) {
    const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds,
    };
  }

  existing.count += 1;
  const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);

  return {
    success: true,
    remaining: limit - existing.count,
    resetSeconds,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}

