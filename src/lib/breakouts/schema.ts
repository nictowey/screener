import { z } from 'zod';

export const HistoricalBarSchema = z.object({
  date: z.union([z.string(), z.coerce.date()]).transform((value) =>
    value instanceof Date ? value.toISOString() : value
  ),
  open: z.number().nonnegative().optional(),
  high: z.number().nonnegative().optional(),
  low: z.number().nonnegative().optional(),
  close: z.number().nonnegative(),
  volume: z.number().nonnegative(),
});

export const FloatDataSchema = z.object({
  floatShares: z.number().positive(),
  outstandingShares: z.number().positive().optional(),
  shortInterestPercent: z.number().min(0).max(100).optional(),
  institutionalOwnershipPercent: z.number().min(0).max(100).optional(),
});

export const CatalystSchema = z.object({
  id: z.string().optional(),
  date: z.union([z.string(), z.coerce.date()]).transform((value) =>
    value instanceof Date ? value.toISOString() : value
  ),
  type: z.string().min(1),
  description: z.string().optional(),
  impact: z.enum(['low', 'medium', 'high']).optional(),
  source: z.string().url().optional(),
});

export const NormalizedBreakoutDataSchema = z.object({
  symbol: z.string().min(1),
  priceHistory: z.array(HistoricalBarSchema).min(2),
  float: FloatDataSchema,
  catalysts: z.array(CatalystSchema).default([]),
});

export const BreakoutMetricsSchema = z.object({
  momentum: z.number(),
  volumeSurge: z.number(),
  floatRotation: z.number(),
  catalystBoost: z.number(),
  overallScore: z.number(),
});

export const BreakoutCandidateSchema = z.object({
  symbol: z.string(),
  score: z.number(),
  metrics: BreakoutMetricsSchema,
  data: NormalizedBreakoutDataSchema,
});

export const BreakoutFiltersSchema = z.object({
  symbols: z.array(z.string()).min(1),
  minScore: z.number().min(0).max(1).optional(),
  limit: z.number().int().positive().optional(),
});

export type HistoricalBar = z.infer<typeof HistoricalBarSchema>;
export type FloatData = z.infer<typeof FloatDataSchema>;
export type Catalyst = z.infer<typeof CatalystSchema>;
export type NormalizedBreakoutData = z.infer<typeof NormalizedBreakoutDataSchema>;
export type BreakoutMetrics = z.infer<typeof BreakoutMetricsSchema>;
export type BreakoutCandidate = z.infer<typeof BreakoutCandidateSchema>;
export type BreakoutFilters = z.infer<typeof BreakoutFiltersSchema>;
