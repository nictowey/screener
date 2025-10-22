import 'server-only';

import dayjs from 'dayjs';
import { z } from 'zod';

export interface BreakoutSymbol {
  symbol: string;
  name: string;
  score: number;
  changePercent: number;
  price: number;
  volume: number;
  relativeStrength: number;
  basePattern: string;
  breakoutDate: string;
}

export interface BreakoutScoreBucket {
  label: string;
  value: number;
}

export interface BreakoutStatsSummary {
  totalBreakouts: number;
  highConviction: number;
  watchlistCandidates: number;
  averageScore: number;
  medianScore: number;
  newHighs: number;
  percentGreen: number;
  totalVolume: number;
}

export interface BreakoutOverviewData {
  generatedAt: string;
  topSymbols: BreakoutSymbol[];
  scoreBuckets: BreakoutScoreBucket[];
  stats: BreakoutStatsSummary;
}

export interface BreakoutOverviewResult {
  data: BreakoutOverviewData;
  isFallback: boolean;
  error?: string;
}

const symbolSchema = z.object({
  symbol: z.string(),
  name: z.string().optional().default(''),
  score: z.number(),
  changePercent: z.number(),
  price: z.number(),
  volume: z.number(),
  relativeStrength: z.number().optional().default(0),
  basePattern: z.string().optional().default(''),
  breakoutDate: z.string().refine((value) => dayjs(value).isValid(), {
    message: 'Invalid breakoutDate',
  }),
});

const bucketSchema = z.object({
  label: z.string(),
  value: z.number(),
});

const statsSchema = z.object({
  totalBreakouts: z.number(),
  highConviction: z.number(),
  watchlistCandidates: z.number(),
  averageScore: z.number(),
  medianScore: z.number(),
  newHighs: z.number(),
  percentGreen: z.number().min(0).max(100),
  totalVolume: z.number(),
});

const overviewSchema = z.object({
  generatedAt: z.string().refine((value) => dayjs(value).isValid(), {
    message: 'Invalid generatedAt value',
  }),
  topSymbols: z.array(symbolSchema),
  scoreBuckets: z.array(bucketSchema),
  stats: statsSchema,
});

const fallbackOverview: BreakoutOverviewData = {
  generatedAt: dayjs().toISOString(),
  topSymbols: [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      score: 97,
      changePercent: 5.8,
      price: 131.24,
      volume: 65843219,
      relativeStrength: 98,
      basePattern: 'Ascending Base',
      breakoutDate: dayjs().subtract(1, 'day').toISOString(),
    },
    {
      symbol: 'SMCI',
      name: 'Super Micro Computer',
      score: 94,
      changePercent: 4.1,
      price: 1087.6,
      volume: 4356712,
      relativeStrength: 96,
      basePattern: 'Flat Base',
      breakoutDate: dayjs().subtract(1, 'day').toISOString(),
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      score: 92,
      changePercent: 3.6,
      price: 281.44,
      volume: 61234123,
      relativeStrength: 92,
      basePattern: 'Cup with Handle',
      breakoutDate: dayjs().subtract(2, 'days').toISOString(),
    },
    {
      symbol: 'META',
      name: 'Meta Platforms',
      score: 90,
      changePercent: 2.9,
      price: 457.8,
      volume: 21876109,
      relativeStrength: 89,
      basePattern: 'Double Bottom',
      breakoutDate: dayjs().subtract(2, 'days').toISOString(),
    },
    {
      symbol: 'MSTR',
      name: 'MicroStrategy',
      score: 89,
      changePercent: 6.2,
      price: 1387.25,
      volume: 2876341,
      relativeStrength: 94,
      basePattern: 'High Tight Flag',
      breakoutDate: dayjs().subtract(3, 'days').toISOString(),
    },
    {
      symbol: 'AVGO',
      name: 'Broadcom Inc.',
      score: 88,
      changePercent: 2.4,
      price: 1692.18,
      volume: 7236541,
      relativeStrength: 90,
      basePattern: 'Ascending Base',
      breakoutDate: dayjs().subtract(3, 'days').toISOString(),
    },
    {
      symbol: 'LRCX',
      name: 'Lam Research',
      score: 86,
      changePercent: 2.1,
      price: 1024.53,
      volume: 2835476,
      relativeStrength: 88,
      basePattern: 'Flat Base',
      breakoutDate: dayjs().subtract(4, 'days').toISOString(),
    },
    {
      symbol: 'ASML',
      name: 'ASML Holding',
      score: 85,
      changePercent: 1.8,
      price: 895.78,
      volume: 1423541,
      relativeStrength: 87,
      basePattern: 'Cup with Handle',
      breakoutDate: dayjs().subtract(5, 'days').toISOString(),
    },
    {
      symbol: 'ANET',
      name: 'Arista Networks',
      score: 84,
      changePercent: 2.5,
      price: 356.92,
      volume: 3675123,
      relativeStrength: 85,
      basePattern: 'Ascending Base',
      breakoutDate: dayjs().subtract(4, 'days').toISOString(),
    },
    {
      symbol: 'NFLX',
      name: 'Netflix Inc.',
      score: 83,
      changePercent: 1.9,
      price: 645.31,
      volume: 13425678,
      relativeStrength: 84,
      basePattern: 'Cup with Handle',
      breakoutDate: dayjs().subtract(6, 'days').toISOString(),
    },
  ],
  scoreBuckets: [
    { label: '95+', value: 3 },
    { label: '90-94', value: 4 },
    { label: '85-89', value: 2 },
    { label: '80-84', value: 1 },
  ],
  stats: {
    totalBreakouts: 42,
    highConviction: 18,
    watchlistCandidates: 27,
    averageScore: 88.6,
    medianScore: 87.5,
    newHighs: 9,
    percentGreen: 71,
    totalVolume: 258_000_000,
  },
};

export async function getBreakoutOverview(): Promise<BreakoutOverviewResult> {
  const baseUrl = process.env.BREAKOUT_SERVICE_URL ?? process.env.NEXT_PUBLIC_BREAKOUT_SERVICE_URL;

  if (!baseUrl) {
    return { data: fallbackOverview, isFallback: true, error: 'Breakout service URL is not configured.' };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/overview`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const json = await response.json();
    const parsed = overviewSchema.parse(json);

    return {
      data: parsed,
      isFallback: false,
    };
  } catch (error) {
    console.error('Failed to fetch breakout overview', error);

    return {
      data: fallbackOverview,
      isFallback: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
