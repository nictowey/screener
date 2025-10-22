import { describe, expect, it } from 'vitest';
import { BreakoutWeights, calculateBreakoutScore, calculateMomentumScore, calculateVolumeScore } from '../scoring';
import { NormalizedBreakoutData } from '../schema';

const baseData: NormalizedBreakoutData = {
  symbol: 'TEST',
  priceHistory: Array.from({ length: 21 }, (_, index) => ({
    date: `2024-01-${(index + 1).toString().padStart(2, '0')}`,
    close: 10 + index * 0.5,
    volume: 1_000_000 + index * 10_000,
  })),
  float: {
    floatShares: 20_000_000,
    outstandingShares: 25_000_000,
    shortInterestPercent: 12,
  },
  catalysts: [
    { date: '2024-01-21', type: 'Earnings', impact: 'high' },
    { date: '2024-01-18', type: 'Analyst Upgrade', impact: 'medium' },
  ],
};

describe('calculateMomentumScore', () => {
  it('rewards strong upward price trends', () => {
    const score = calculateMomentumScore(baseData);
    expect(score).toBeGreaterThan(0.5);
  });

  it('floors the score when no movement occurs', () => {
    const flatData: NormalizedBreakoutData = {
      ...baseData,
      priceHistory: baseData.priceHistory.map((bar) => ({ ...bar, close: 10 })),
    };
    const score = calculateMomentumScore(flatData);
    expect(score).toBe(0);
  });
});

describe('calculateVolumeScore', () => {
  it('captures relative volume surges', () => {
    const surgeData: NormalizedBreakoutData = {
      ...baseData,
      priceHistory: baseData.priceHistory.map((bar, index) => ({
        ...bar,
        volume: index >= baseData.priceHistory.length - 5 ? bar.volume * 5 : bar.volume,
      })),
    };
    const score = calculateVolumeScore(surgeData);
    expect(score).toBeGreaterThan(0.5);
  });

  it('returns zero when baseline volume is missing', () => {
    const lowVolumeData: NormalizedBreakoutData = {
      ...baseData,
      priceHistory: baseData.priceHistory.map((bar) => ({ ...bar, volume: 0 })),
    };
    const score = calculateVolumeScore(lowVolumeData);
    expect(score).toBe(0);
  });
});

describe('calculateBreakoutScore', () => {
  it('combines weighted components into the final score', () => {
    const weights: BreakoutWeights = {
      momentum: 0.4,
      volume: 0.3,
      float: 0.2,
      catalysts: 0.1,
    };
    const metrics = calculateBreakoutScore(baseData, weights);
    expect(metrics.overallScore).toBeGreaterThan(0);
    expect(metrics.overallScore).toBeLessThanOrEqual(1);
  });

  it('handles zeroed weights without crashing', () => {
    const metrics = calculateBreakoutScore(baseData, {
      momentum: 0,
      volume: 0,
      float: 0,
      catalysts: 0,
    });
    expect(metrics.overallScore).toBe(0);
  });
});
