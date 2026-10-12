// Cache public catalog data only. Booking submissions always reach the server.
const cache = new Map<string, { value: unknown; expires: number }>();

export async function cachedCatalog<T>(key: string, request: () => PromiseLike<{ data: T; error: unknown }>, signal: AbortSignal): Promise<T> {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.value as T;
  const { data, error } = await request();
  if (error) throw error;
  if (signal.aborted) throw new Error("Catalog request cancelled");
  cache.set(key, { value: data, expires: Date.now() + 60000 });
  return data;
}
