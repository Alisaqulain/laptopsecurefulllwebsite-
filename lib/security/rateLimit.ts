type Bucket = {
  resetAt: number;
  count: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __rlBuckets: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> = globalThis.__rlBuckets ?? (globalThis.__rlBuckets = new Map());

export function rateLimit(key: string, opts?: { limit?: number; windowMs?: number }) {
  const limit = opts?.limit ?? 60;
  const windowMs = opts?.windowMs ?? 60_000;

  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { resetAt: now + windowMs, count: 1 });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}

