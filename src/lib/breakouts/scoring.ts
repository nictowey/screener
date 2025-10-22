import { NormalizedBreakoutData, BreakoutMetrics } from './schema';

export type BreakoutWeights = {
  momentum: number;
  volume: number;
  float: number;
  catalysts: number;
};

export const defaultBreakoutWeights: BreakoutWeights = {
  momentum: 0.4,
  volume: 0.25,
  float: 0.2,
  catalysts: 0.15,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const calculateMomentumScore = (data: NormalizedBreakoutData): number => {
  const { priceHistory } = data;
  const lookback = Math.min(priceHistory.length - 1, 20);
  const recent = priceHistory.slice(-lookback - 1);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const percentChange = first.close === 0 ? 0 : (last.close - first.close) / first.close;
  const intradayRange = last.high && last.low ? last.high - last.low : last.close * 0.02;
  const volatilityAdjustment = intradayRange === 0 ? 1 : clamp(intradayRange / last.close, 0, 0.1);
  const adjustedChange = percentChange * (1 - volatilityAdjustment);
  return clamp(adjustedChange / 0.5, 0, 1);
};

export const calculateVolumeScore = (data: NormalizedBreakoutData): number => {
  const { priceHistory } = data;
  const recentWindow = priceHistory.slice(-5);
  const baselineWindow = priceHistory.slice(0, -5);
  const recentAvg =
    recentWindow.reduce((total, item) => total + item.volume, 0) / Math.max(recentWindow.length, 1);
  const baselineAvg =
    baselineWindow.reduce((total, item) => total + item.volume, 0) / Math.max(baselineWindow.length, 1);
  if (!Number.isFinite(recentAvg) || recentAvg === 0 || !Number.isFinite(baselineAvg) || baselineAvg === 0) {
    return 0;
  }
  const relativeVolume = recentAvg / baselineAvg;
  return clamp((relativeVolume - 1) / 4, 0, 1);
};

export const calculateFloatScore = (data: NormalizedBreakoutData): number => {
  const { priceHistory, float } = data;
  const recentWindow = priceHistory.slice(-5);
  const averageVolume =
    recentWindow.reduce((total, item) => total + item.volume, 0) / Math.max(recentWindow.length, 1);
  if (!Number.isFinite(averageVolume) || averageVolume === 0) {
    return 0;
  }
  const rotation = float.floatShares / averageVolume;
  const shortInterest = (float.shortInterestPercent ?? 0) / 100;
  const rotationScore = clamp(1 - rotation / 10, 0, 1);
  const shortInterestBonus = clamp(shortInterest / 0.3, 0, 0.3);
  return clamp(rotationScore + shortInterestBonus, 0, 1);
};

export const calculateCatalystScore = (data: NormalizedBreakoutData): number => {
  if (!data.catalysts.length) {
    return 0;
  }
  const boosts = data.catalysts.map((catalyst) => {
    const impact = catalyst.impact ?? 'medium';
    switch (impact) {
      case 'high':
        return 1;
      case 'medium':
        return 0.6;
      case 'low':
      default:
        return 0.3;
    }
  });
  const averageBoost = boosts.reduce((total, value) => total + value, 0) / boosts.length;
  return clamp(averageBoost, 0, 1);
};

export const calculateBreakoutScore = (
  data: NormalizedBreakoutData,
  weights: BreakoutWeights = defaultBreakoutWeights
): BreakoutMetrics => {
  const momentum = calculateMomentumScore(data);
  const volumeSurge = calculateVolumeScore(data);
  const floatRotation = calculateFloatScore(data);
  const catalystBoost = calculateCatalystScore(data);

  const totalWeight = weights.momentum + weights.volume + weights.float + weights.catalysts;
  const weightedScore =
    momentum * weights.momentum +
    volumeSurge * weights.volume +
    floatRotation * weights.float +
    catalystBoost * weights.catalysts;

  const overallScore = totalWeight === 0 ? 0 : weightedScore / totalWeight;

  return {
    momentum,
    volumeSurge,
    floatRotation,
    catalystBoost,
    overallScore,
  };
};
