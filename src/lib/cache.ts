import { StockPick } from './screener';

interface CacheEntry {
  picks: StockPick[];
  generatedAt: string;
  expiresAt: number;
}

// In-memory cache — survives across requests in the same server process.
// Expires after 4 hours so picks refresh multiple times per trading day.
const CACHE_TTL_MS = 4 * 60 * 60 * 1000;
let cache: CacheEntry | null = null;

export function getCachedPicks(): CacheEntry | null {
  if (!cache) return null;
  if (Date.now() > cache.expiresAt) {
    cache = null;
    return null;
  }
  return cache;
}

export function setCachedPicks(picks: StockPick[]): CacheEntry {
  cache = {
    picks,
    generatedAt: new Date().toISOString(),
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  return cache;
}
