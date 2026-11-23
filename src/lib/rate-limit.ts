/**
 * Simple in-memory sliding-window rate limiter.
 * Limitation: on Vercel each serverless instance has its own memory, so this is a
 * best-effort guard against accidental floods, not a security control. See docs/03-architecture.md.
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Returns true if the request is allowed, and records it. */
  allow(key: string, now: number = Date.now()): boolean {
    const windowStart = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > windowStart);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) this.prune(windowStart);
    return true;
  }

  private prune(windowStart: number) {
    for (const [key, times] of Array.from(this.hits.entries())) {
      if (times.every((t) => t <= windowStart)) this.hits.delete(key);
    }
  }
}

export const checkLimiter = new RateLimiter(10, 60_000);
