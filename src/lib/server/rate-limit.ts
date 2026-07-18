interface ClientRateData {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, ClientRateData>();

// Simple in-memory clean up cycle to prevent memory leaks in long-running sessions
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipCache.entries()) {
      if (now > data.resetTime) {
        ipCache.delete(ip);
      }
    }
  }, 60000); // Clean expired entries every minute
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks if a given IP has exceeded the limit in the current window.
 */
export function rateLimit(
  ip: string,
  limit: number = 30, // Default 30 requests
  windowMs: number = 60 * 1000 // Default 1 minute window
): RateLimitResult {
  const now = Date.now();
  const clientData = ipCache.get(ip);

  if (!clientData || now > clientData.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000)
    };
  }

  if (clientData.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.ceil((clientData.resetTime - now) / 1000)
    };
  }

  clientData.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - clientData.count,
    resetSeconds: Math.ceil((clientData.resetTime - now) / 1000)
  };
}
