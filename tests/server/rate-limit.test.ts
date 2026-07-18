import { describe, it, expect, vi } from 'vitest';
import { rateLimit } from '@/lib/server/rate-limit';

describe('Server Rate Limiter Tests', () => {
  it('should allow requests within limit and block when exceeded', () => {
    const testIp = '192.168.1.100';
    
    // Simulate 3 requests (limit of 3)
    const r1 = rateLimit(testIp, 3, 10000);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit(testIp, 3, 10000);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit(testIp, 3, 10000);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th request should exceed limit
    const r4 = rateLimit(testIp, 3, 10000);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.resetSeconds).toBeGreaterThan(0);
  });

  it('should reset limits when window expires', () => {
    const tempIp = '10.0.0.1';
    
    // Set mock time
    vi.useFakeTimers();
    
    const r1 = rateLimit(tempIp, 2, 5000);
    expect(r1.success).toBe(true);

    const r2 = rateLimit(tempIp, 2, 5000);
    expect(r2.success).toBe(true);

    // Blocked
    const r3 = rateLimit(tempIp, 2, 5000);
    expect(r3.success).toBe(false);

    // Fast-forward time by 6 seconds
    vi.advanceTimersByTime(6000);

    // Should be allowed again
    const r4 = rateLimit(tempIp, 2, 5000);
    expect(r4.success).toBe(true);
    expect(r4.remaining).toBe(1);
    
    vi.useRealTimers();
  });
});
