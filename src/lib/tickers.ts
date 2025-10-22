import dayjs from 'dayjs';

export interface TickerSummary {
  symbol: string;
  name: string;
  sector: string;
}

export interface TickerQuote {
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  updatedAt: string;
}

export interface TickerFundamental {
  metric: string;
  value: string;
}

export interface TickerNewsItem {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface BreakoutScorePoint {
  label: string;
  score: number;
}

export interface TickerDetails extends TickerSummary {
  quote: TickerQuote;
  fundamentals: TickerFundamental[];
  news: TickerNewsItem[];
  breakoutHistory: BreakoutScorePoint[];
}

interface ProviderResult<T> {
  data: T;
  priority: number;
}

type ValueProvider<T> = (symbol: string) => Promise<ProviderResult<T> | null>;
type CollectionProvider<T> = (symbol: string) => Promise<ProviderResult<T[]> | null>;

type MockTickerData = {
  summary: TickerSummary;
  quote: TickerQuote;
  fundamentals: TickerFundamental[];
  news: TickerNewsItem[];
  breakoutHistory: BreakoutScorePoint[];
};

const mockTickers: Record<string, MockTickerData> = {
  AAPL: {
    summary: { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology Hardware' },
    quote: {
      currency: 'USD',
      price: 182.54,
      change: 1.24,
      changePercent: 0.68,
      previousClose: 181.3,
      open: 180.92,
      high: 183.51,
      low: 179.88,
      volume: 48952311,
      updatedAt: dayjs().subtract(12, 'minutes').toISOString(),
    },
    fundamentals: [
      { metric: 'Market Cap', value: '$2.82T' },
      { metric: 'P/E Ratio (TTM)', value: '28.4x' },
      { metric: 'Dividend Yield', value: '0.48%' },
      { metric: '52 Week Range', value: '$164.07 - $199.62' },
      { metric: 'Revenue (TTM)', value: '$383.3B' },
    ],
    news: [
      {
        id: 'aapl-news-1',
        title: 'Apple unveils on-device AI roadmap ahead of WWDC',
        publisher: 'Tech Daily',
        url: 'https://example.com/apple-ai-roadmap',
        publishedAt: dayjs().subtract(2, 'hours').toISOString(),
        sentiment: 'positive',
      },
      {
        id: 'aapl-news-2',
        title: 'Supply chain partners signal steady demand for iPhone refresh',
        publisher: 'Market Watchers',
        url: 'https://example.com/apple-supply-chain',
        publishedAt: dayjs().subtract(6, 'hours').toISOString(),
        sentiment: 'neutral',
      },
    ],
    breakoutHistory: [
      { label: 'Mon', score: 62 },
      { label: 'Tue', score: 68 },
      { label: 'Wed', score: 74 },
      { label: 'Thu', score: 71 },
      { label: 'Fri', score: 79 },
    ],
  },
  MSFT: {
    summary: { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Software' },
    quote: {
      currency: 'USD',
      price: 318.41,
      change: -2.37,
      changePercent: -0.74,
      previousClose: 320.78,
      open: 321.1,
      high: 323.51,
      low: 316.87,
      volume: 29856420,
      updatedAt: dayjs().subtract(9, 'minutes').toISOString(),
    },
    fundamentals: [
      { metric: 'Market Cap', value: '$2.38T' },
      { metric: 'P/E Ratio (TTM)', value: '33.2x' },
      { metric: 'Free Cash Flow Yield', value: '3.6%' },
      { metric: 'Net Margin', value: '35.1%' },
      { metric: 'Revenue (TTM)', value: '$232.6B' },
    ],
    news: [
      {
        id: 'msft-news-1',
        title: 'Microsoft expands Azure OpenAI availability to additional regions',
        publisher: 'Cloud Wire',
        url: 'https://example.com/microsoft-azure-openai',
        publishedAt: dayjs().subtract(3, 'hours').toISOString(),
        sentiment: 'positive',
      },
      {
        id: 'msft-news-2',
        title: 'Regulators scrutinize Activision integration progress',
        publisher: 'Global Markets Journal',
        url: 'https://example.com/microsoft-activision-update',
        publishedAt: dayjs().subtract(8, 'hours').toISOString(),
        sentiment: 'neutral',
      },
    ],
    breakoutHistory: [
      { label: 'Mon', score: 58 },
      { label: 'Tue', score: 63 },
      { label: 'Wed', score: 66 },
      { label: 'Thu', score: 64 },
      { label: 'Fri', score: 69 },
    ],
  },
  TSLA: {
    summary: { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Automobiles' },
    quote: {
      currency: 'USD',
      price: 186.25,
      change: 4.21,
      changePercent: 2.31,
      previousClose: 182.04,
      open: 183.11,
      high: 188.72,
      low: 179.41,
      volume: 61804400,
      updatedAt: dayjs().subtract(5, 'minutes').toISOString(),
    },
    fundamentals: [
      { metric: 'Market Cap', value: '$592.6B' },
      { metric: 'P/E Ratio (TTM)', value: '52.7x' },
      { metric: 'Gross Margin', value: '19.8%' },
      { metric: 'Revenue (TTM)', value: '$96.8B' },
      { metric: 'Debt-to-Equity', value: '0.17x' },
    ],
    news: [
      {
        id: 'tsla-news-1',
        title: 'Tesla accelerates Cybertruck production ramp in Austin',
        publisher: 'EV Pulse',
        url: 'https://example.com/tesla-cybertruck-ramp',
        publishedAt: dayjs().subtract(1, 'hours').toISOString(),
        sentiment: 'positive',
      },
      {
        id: 'tsla-news-2',
        title: 'Competition heats up in China as local EV makers cut prices',
        publisher: 'Asia Markets',
        url: 'https://example.com/tesla-china-competition',
        publishedAt: dayjs().subtract(7, 'hours').toISOString(),
        sentiment: 'negative',
      },
    ],
    breakoutHistory: [
      { label: 'Mon', score: 52 },
      { label: 'Tue', score: 57 },
      { label: 'Wed', score: 61 },
      { label: 'Thu', score: 60 },
      { label: 'Fri', score: 68 },
    ],
  },
  NVDA: {
    summary: { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors' },
    quote: {
      currency: 'USD',
      price: 912.83,
      change: 6.35,
      changePercent: 0.7,
      previousClose: 906.48,
      open: 899.21,
      high: 915.67,
      low: 887.92,
      volume: 32114544,
      updatedAt: dayjs().subtract(4, 'minutes').toISOString(),
    },
    fundamentals: [
      { metric: 'Market Cap', value: '$2.26T' },
      { metric: 'P/E Ratio (TTM)', value: '72.1x' },
      { metric: 'Revenue (TTM)', value: '$60.9B' },
      { metric: 'Quarterly Revenue Growth', value: '262%' },
      { metric: 'Return on Equity', value: '92.3%' },
    ],
    news: [
      {
        id: 'nvda-news-1',
        title: 'NVIDIA launches next-gen enterprise GPU for AI factories',
        publisher: 'Silicon Valley Digest',
        url: 'https://example.com/nvidia-enterprise-gpu',
        publishedAt: dayjs().subtract(30, 'minutes').toISOString(),
        sentiment: 'positive',
      },
      {
        id: 'nvda-news-2',
        title: 'Analysts debate sustainability of hyperscale demand',
        publisher: 'Equity Research Daily',
        url: 'https://example.com/nvidia-demand-outlook',
        publishedAt: dayjs().subtract(5, 'hours').toISOString(),
        sentiment: 'neutral',
      },
    ],
    breakoutHistory: [
      { label: 'Mon', score: 78 },
      { label: 'Tue', score: 82 },
      { label: 'Wed', score: 88 },
      { label: 'Thu', score: 90 },
      { label: 'Fri', score: 94 },
    ],
  },
};

async function resolveFromProviders<T>(symbol: string, providers: ValueProvider<T>[]): Promise<T | null> {
  const responses = await Promise.all(providers.map((provider) => provider(symbol)));
  const validResponses = responses.filter((response): response is ProviderResult<T> => response !== null);

  if (validResponses.length === 0) {
    return null;
  }

  validResponses.sort((a, b) => a.priority - b.priority);

  return validResponses[0]?.data ?? null;
}

async function resolveCollectionFromProviders<T>(symbol: string, providers: CollectionProvider<T>[]): Promise<T[]> {
  const responses = await Promise.all(providers.map((provider) => provider(symbol)));
  const validResponses = responses.filter((response): response is ProviderResult<T[]> => response !== null);

  if (validResponses.length === 0) {
    return [];
  }

  validResponses.sort((a, b) => a.priority - b.priority);

  const dedupeKey = (value: unknown): string =>
    typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);

  const seen = new Set<string>();

  return validResponses.flatMap(({ data }) =>
    data.filter((entry) => {
      const key = dedupeKey(entry);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    }),
  );
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const quoteProviders: ValueProvider<TickerQuote>[] = [
  async (symbol) => {
    const record = mockTickers[symbol];
    if (!record) {
      return null;
    }

    await delay(80);

    return { data: record.quote, priority: 1 };
  },
  async (symbol) => {
    const record = mockTickers[symbol];
    if (!record) {
      return null;
    }

    await delay(150);

    return { data: { ...record.quote, updatedAt: dayjs(record.quote.updatedAt).subtract(3, 'minutes').toISOString() }, priority: 2 };
  },
];

const fundamentalsProviders: CollectionProvider<TickerFundamental>[] = [
  async (symbol) => {
    const record = mockTickers[symbol];
    if (!record) {
      return null;
    }

    await delay(90);

    return { data: record.fundamentals, priority: 1 };
  },
];

const newsProviders: CollectionProvider<TickerNewsItem>[] = [
  async (symbol) => {
    const record = mockTickers[symbol];
    if (!record) {
      return null;
    }

    await delay(120);

    return { data: record.news, priority: 1 };
  },
];

const breakoutProviders: CollectionProvider<BreakoutScorePoint>[] = [
  async (symbol) => {
    const record = mockTickers[symbol];
    if (!record) {
      return null;
    }

    await delay(110);

    return { data: record.breakoutHistory, priority: 1 };
  },
];

export function listAvailableTickers(): TickerSummary[] {
  return Object.values(mockTickers)
    .map(({ summary }) => summary)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}

export async function findTickerDetails(symbol: string): Promise<TickerDetails | null> {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return null;
  }

  const record = mockTickers[normalizedSymbol];

  if (!record) {
    return null;
  }

  const [quote, fundamentals, news, breakoutHistory] = await Promise.all([
    resolveFromProviders(normalizedSymbol, quoteProviders),
    resolveCollectionFromProviders(normalizedSymbol, fundamentalsProviders),
    resolveCollectionFromProviders(normalizedSymbol, newsProviders),
    resolveCollectionFromProviders(normalizedSymbol, breakoutProviders),
  ]);

  if (!quote) {
    return null;
  }

  return {
    symbol: record.summary.symbol,
    name: record.summary.name,
    sector: record.summary.sector,
    quote,
    fundamentals,
    news,
    breakoutHistory,
  } satisfies TickerDetails;
}
