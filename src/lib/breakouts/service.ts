import { providers as defaultProviders, BreakoutProvider } from '@/lib/providers';
import {
  BreakoutCandidate,
  BreakoutCandidateSchema,
  BreakoutFilters,
  BreakoutFiltersSchema,
  NormalizedBreakoutData,
  NormalizedBreakoutDataSchema,
} from './schema';
import { BreakoutWeights, calculateBreakoutScore, defaultBreakoutWeights } from './scoring';

type ProviderOverrides = Partial<BreakoutProvider>;

export interface BreakoutServiceOptions {
  providers?: ProviderOverrides;
  weights?: BreakoutWeights;
}

const normalizeHistoricalBars = (bars: Awaited<ReturnType<BreakoutProvider['getPriceVolumeHistory']>>) =>
  bars.map((bar) => ({
    date: bar.date,
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: bar.volume,
  }));

const normalizeFloatData = (floatData: Awaited<ReturnType<BreakoutProvider['getFloatData']>>) => ({
  floatShares: floatData.floatShares,
  outstandingShares: floatData.outstandingShares,
  shortInterestPercent: floatData.shortInterestPercent,
  institutionalOwnershipPercent: floatData.institutionalOwnershipPercent,
});

const normalizeCatalysts = (catalysts: Awaited<ReturnType<BreakoutProvider['getCatalystEvents']>>) =>
  catalysts.map((catalyst) => ({
    id: catalyst.id,
    date: catalyst.date,
    type: catalyst.type,
    description: catalyst.description,
    impact: catalyst.impact,
    source: catalyst.source,
  }));

const mergeProviders = (overrides?: ProviderOverrides): BreakoutProvider => ({
  ...defaultProviders,
  ...overrides,
});

export const loadBreakoutData = async (
  symbol: string,
  options: BreakoutServiceOptions = {}
): Promise<NormalizedBreakoutData> => {
  const providers = mergeProviders(options.providers);

  try {
    const [priceHistory, floatData, catalysts] = await Promise.all([
      providers.getPriceVolumeHistory(symbol),
      providers.getFloatData(symbol),
      providers.getCatalystEvents(symbol),
    ]);

    const normalized = NormalizedBreakoutDataSchema.parse({
      symbol,
      priceHistory: normalizeHistoricalBars(priceHistory),
      float: normalizeFloatData(floatData),
      catalysts: normalizeCatalysts(catalysts),
    });

    return normalized;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to load breakout data for ${symbol}: ${message}`);
  }
};

export const scoreBreakoutCandidate = (
  data: NormalizedBreakoutData,
  weights: BreakoutWeights = defaultBreakoutWeights
): BreakoutCandidate => {
  const metrics = calculateBreakoutScore(data, weights);
  return BreakoutCandidateSchema.parse({
    symbol: data.symbol,
    score: metrics.overallScore,
    metrics,
    data,
  });
};

export const rankBreakoutCandidates = (
  candidates: BreakoutCandidate[],
  filters: Pick<BreakoutFilters, 'minScore' | 'limit'> = {}
): BreakoutCandidate[] => {
  const minScore = filters.minScore ?? 0;
  const limit = filters.limit ?? candidates.length;

  return candidates
    .filter((candidate) => candidate.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getBreakoutCandidates = async (
  filters: BreakoutFilters,
  options: BreakoutServiceOptions = {}
): Promise<BreakoutCandidate[]> => {
  const parsedFilters = BreakoutFiltersSchema.parse(filters);
  const providers = mergeProviders(options.providers);
  const weights = options.weights ?? defaultBreakoutWeights;

  const results = await Promise.all(
    parsedFilters.symbols.map(async (symbol) => {
      try {
        const data = await loadBreakoutData(symbol, { providers });
        return scoreBreakoutCandidate(data, weights);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Unable to score breakout candidate for ${symbol}: ${message}`);
      }
    })
  );

  return rankBreakoutCandidates(results, {
    minScore: parsedFilters.minScore,
    limit: parsedFilters.limit,
  });
};
