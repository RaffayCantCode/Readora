type CacheEntry<T> = { value: T; expiresAt: number };

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 1000 * 60 * 10;

export async function withCache<T>(key: string, loader: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
  const existing = cache.get(key);
  if (existing && existing.expiresAt > Date.now()) return existing.value as T;
  const value = await loader();

  // Do not cache empty/degraded responses
  if (
    value &&
    typeof value === "object" &&
    "books" in value &&
    Array.isArray((value as { books?: unknown[] }).books) &&
    (value as { books?: unknown[] }).books?.length === 0
  ) {
    return value;
  }

  cache.set(key, { value, expiresAt: Date.now() + ttl });
  return value;
}
