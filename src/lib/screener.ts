import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();

export interface StockPick {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  sector: string;
  revenueGrowth: number;       // YoY revenue growth %
  earningsGrowth: number;      // YoY earnings growth %
  returnOnEquity: number;      // ROE %
  debtToEquity: number;        // D/E ratio
  pegRatio: number;            // PEG ratio
  relativeStrength3m: number;  // 3-month price change %
  relativeStrength6m: number;  // 6-month price change %
  relativeStrength1y: number;  // 1-year price change %
  fiftyDayAvg: number;
  twoHundredDayAvg: number;
  compositeScore: number;      // Our weighted score
  reasons: string[];           // Why this stock was picked
}

// Thresholds for 2-year big gain screening
const CRITERIA = {
  MIN_REVENUE_GROWTH: 10,       // >10% YoY revenue growth
  MIN_EARNINGS_GROWTH: 15,      // >15% YoY earnings growth
  MAX_DEBT_TO_EQUITY: 2.0,     // Conservative leverage
  MIN_ROE: 10,                  // >10% return on equity
  MAX_PEG: 3.0,                 // Reasonable growth valuation
  MIN_MARKET_CAP: 2e9,          // >$2B market cap
  MIN_RS_3M: -5,                // Not in freefall
};

function safeNum(val: unknown, fallback: number = 0): number {
  if (typeof val === 'number' && isFinite(val)) return val;
  return fallback;
}

export async function screenStock(symbol: string): Promise<StockPick | null> {
  try {
    const summary = await yf.quoteSummary(symbol, {
      modules: ['price', 'defaultKeyStatistics', 'financialData', 'summaryProfile', 'summaryDetail'],
    });

    const price = summary.price;
    const keyStats = summary.defaultKeyStatistics;
    const financials = summary.financialData;
    const profile = summary.summaryProfile;
    const detail = summary.summaryDetail;

    if (!price || !financials) return null;

    const currentPrice = safeNum(price.regularMarketPrice);
    if (currentPrice <= 0) return null;

    const marketCap = safeNum(price.marketCap);
    const revenueGrowth = safeNum(financials.revenueGrowth) * 100;
    const earningsGrowth = safeNum(financials.earningsGrowth) * 100;
    const roe = safeNum(financials.returnOnEquity) * 100;
    const debtToEquity = safeNum(financials.debtToEquity);
    const pegRatio = safeNum(keyStats?.pegRatio, 999);
    const fiftyDayAvg = safeNum(detail?.fiftyDayAverage) || currentPrice;
    const twoHundredDayAvg = safeNum(detail?.twoHundredDayAverage) || currentPrice;

    // Get price history for relative strength
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    let rs3m = 0, rs6m = 0, rs1y = 0;
    let actualFiftyDay = fiftyDayAvg;
    let actualTwoHundredDay = twoHundredDayAvg;

    try {
      const history = await yf.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d',
      });

      if (history.length > 0) {
        const latest = history[history.length - 1].close;

        // 3-month (~63 trading days)
        if (history.length > 63) {
          const ref3m = history[history.length - 63].close;
          rs3m = ((latest - ref3m) / ref3m) * 100;
        }

        // 6-month (~126 trading days)
        if (history.length > 126) {
          const ref6m = history[history.length - 126].close;
          rs6m = ((latest - ref6m) / ref6m) * 100;
        }

        // 1-year
        const ref1y = history[0].close;
        rs1y = ((latest - ref1y) / ref1y) * 100;

        // Calculate actual moving averages from history
        if (history.length >= 50) {
          const last50 = history.slice(-50);
          actualFiftyDay = last50.reduce((s, d) => s + d.close, 0) / 50;
        }
        if (history.length >= 200) {
          const last200 = history.slice(-200);
          actualTwoHundredDay = last200.reduce((s, d) => s + d.close, 0) / 200;
        }
      }
    } catch {
      // Historical data unavailable; proceed with defaults
    }

    // Apply hard filters
    if (marketCap < CRITERIA.MIN_MARKET_CAP) return null;
    if (debtToEquity > CRITERIA.MAX_DEBT_TO_EQUITY && debtToEquity < 900) return null;
    if (rs3m < CRITERIA.MIN_RS_3M) return null;

    // Build reasons and composite score
    const reasons: string[] = [];
    let score = 0;

    // Revenue growth scoring (0-25 points)
    if (revenueGrowth >= 30) { score += 25; reasons.push(`Exceptional revenue growth: ${revenueGrowth.toFixed(1)}%`); }
    else if (revenueGrowth >= 20) { score += 20; reasons.push(`Strong revenue growth: ${revenueGrowth.toFixed(1)}%`); }
    else if (revenueGrowth >= CRITERIA.MIN_REVENUE_GROWTH) { score += 12; reasons.push(`Solid revenue growth: ${revenueGrowth.toFixed(1)}%`); }

    // Earnings growth scoring (0-25 points)
    if (earningsGrowth >= 40) { score += 25; reasons.push(`Explosive earnings growth: ${earningsGrowth.toFixed(1)}%`); }
    else if (earningsGrowth >= 25) { score += 20; reasons.push(`Strong earnings growth: ${earningsGrowth.toFixed(1)}%`); }
    else if (earningsGrowth >= CRITERIA.MIN_EARNINGS_GROWTH) { score += 12; reasons.push(`Good earnings growth: ${earningsGrowth.toFixed(1)}%`); }

    // ROE scoring (0-15 points)
    if (roe >= 25) { score += 15; reasons.push(`Excellent ROE: ${roe.toFixed(1)}%`); }
    else if (roe >= CRITERIA.MIN_ROE) { score += 8; reasons.push(`Healthy ROE: ${roe.toFixed(1)}%`); }

    // PEG ratio scoring (0-10 points) - lower is better
    if (pegRatio > 0 && pegRatio <= 1.0) { score += 10; reasons.push(`Undervalued growth (PEG: ${pegRatio.toFixed(2)})`); }
    else if (pegRatio > 0 && pegRatio <= 2.0) { score += 6; reasons.push(`Fair growth valuation (PEG: ${pegRatio.toFixed(2)})`); }
    else if (pegRatio > 0 && pegRatio <= CRITERIA.MAX_PEG) { score += 3; }

    // Price momentum scoring (0-15 points)
    const aboveFifty = currentPrice > actualFiftyDay;
    const aboveTwoHundred = currentPrice > actualTwoHundredDay;

    if (aboveFifty && aboveTwoHundred) {
      score += 10;
      reasons.push('Price above 50-day and 200-day moving averages');
    } else if (aboveTwoHundred) {
      score += 5;
      reasons.push('Price above 200-day moving average');
    }

    if (rs6m >= 20) { score += 5; reasons.push(`Strong 6-month momentum: +${rs6m.toFixed(1)}%`); }
    else if (rs6m >= 10) { score += 3; }

    // Low debt bonus (0-5 points)
    if (debtToEquity >= 0 && debtToEquity < 0.5) {
      score += 5;
      reasons.push('Very low debt');
    } else if (debtToEquity >= 0 && debtToEquity < 1.0) {
      score += 3;
      reasons.push('Conservative debt levels');
    }

    // 1-year relative strength bonus (0-5 points)
    if (rs1y >= 30) { score += 5; reasons.push(`Strong 1-year performance: +${rs1y.toFixed(1)}%`); }

    // Must have at least some positive signal
    if (score < 15 || reasons.length < 2) return null;

    return {
      symbol,
      name: price.shortName || price.longName || symbol,
      price: currentPrice,
      marketCap,
      sector: profile?.sector || 'Unknown',
      revenueGrowth,
      earningsGrowth,
      returnOnEquity: roe,
      debtToEquity,
      pegRatio,
      relativeStrength3m: rs3m,
      relativeStrength6m: rs6m,
      relativeStrength1y: rs1y,
      fiftyDayAvg: actualFiftyDay,
      twoHundredDayAvg: actualTwoHundredDay,
      compositeScore: score,
      reasons,
    };
  } catch {
    return null;
  }
}

export async function screenBatch(symbols: string[]): Promise<StockPick[]> {
  const BATCH_SIZE = 5;
  const results: StockPick[] = [];

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(screenStock));
    for (const result of batchResults) {
      if (result) results.push(result);
    }
  }

  // Sort by composite score descending
  results.sort((a, b) => b.compositeScore - a.compositeScore);

  return results;
}
