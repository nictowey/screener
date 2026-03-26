import { NextResponse } from 'next/server';

import { getCachedPicks, setCachedPicks } from '@/lib/cache';
import { screenBatch } from '@/lib/screener';
import { STOCK_UNIVERSE } from '@/lib/universe';

export const dynamic = 'force-dynamic';

const TOP_N = 10;

export async function GET() {
  try {
    // Return cached picks if fresh
    const cached = getCachedPicks();
    if (cached) {
      return NextResponse.json({
        picks: cached.picks.slice(0, TOP_N),
        generatedAt: cached.generatedAt,
        totalScreened: STOCK_UNIVERSE.length,
        cached: true,
      });
    }

    // Screen entire universe
    const allPicks = await screenBatch(STOCK_UNIVERSE);
    const entry = setCachedPicks(allPicks);

    return NextResponse.json({
      picks: allPicks.slice(0, TOP_N),
      generatedAt: entry.generatedAt,
      totalScreened: STOCK_UNIVERSE.length,
      cached: false,
    });
  } catch (error) {
    console.error('Screening error:', error);
    return NextResponse.json(
      { error: 'Failed to screen stocks. Please try again later.' },
      { status: 500 },
    );
  }
}
