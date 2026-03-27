// WARNING: This rate limiter is in-memory and does NOT persist across
// Vercel serverless invocations. Replace with Upstash/Redis for production.
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit = 10, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
