import * as React from 'react';
import type { Metadata } from 'next';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';

import { config } from '@/config';
import { BreakoutLeaderboard } from '@/components/dashboard/overview/breakout-leaderboard';
import { BreakoutScoreBreakdown } from '@/components/dashboard/overview/breakout-score-breakdown';
import { BreakoutStatsCard } from '@/components/dashboard/overview/breakout-stats-card';
import { getBreakoutOverview } from '@/services/breakout';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

const integerFormatter = new Intl.NumberFormat('en-US');
const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const decimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export default async function Page(): Promise<React.JSX.Element> {
  const breakout = await getBreakoutOverview();
  const { data, error, isFallback } = breakout;
  const { stats, topSymbols, scoreBuckets } = data;

  const highConvictionShare = stats.totalBreakouts
    ? Math.round((stats.highConviction / stats.totalBreakouts) * 100)
    : 0;

  const statsCards = [
    {
      key: 'total-breakouts',
      title: 'Total breakouts',
      value: integerFormatter.format(stats.totalBreakouts),
      caption: `${stats.highConviction} high-conviction setups`,
      trend: highConvictionShare >= 50 ? 'up' : 'down',
      trendValue: `${highConvictionShare}% HC`,
    },
    {
      key: 'average-score',
      title: 'Average score',
      value: decimalFormatter.format(stats.averageScore),
      caption: `Median ${decimalFormatter.format(stats.medianScore)}`,
    },
    {
      key: 'new-highs',
      title: '52-week highs',
      value: integerFormatter.format(stats.newHighs),
      caption: `${stats.watchlistCandidates} watchlist ready`,
    },
    {
      key: 'breakout-volume',
      title: 'Breakout volume',
      value: compactFormatter.format(stats.totalVolume),
      caption: 'Market breadth',
      trend: stats.percentGreen >= 50 ? 'up' : 'down',
      trendValue: `${decimalFormatter.format(stats.percentGreen)}% green`,
    },
  ] as const;

  return (
    <Grid container spacing={3}>
      {error ? (
        <Grid size={{ xs: 12 }}>
          <Alert severity={isFallback ? 'warning' : 'error'} variant="outlined">
            <AlertTitle>{isFallback ? 'Using fallback data' : 'Unable to load breakout data'}</AlertTitle>
            {error}
          </Alert>
        </Grid>
      ) : null}
      {statsCards.map((card) => (
        <Grid
          key={card.key}
          size={{
            lg: 3,
            sm: 6,
            xs: 12,
          }}
        >
          <BreakoutStatsCard
            caption={card.caption}
            title={card.title}
            trend={card.trend}
            trendValue={card.trendValue}
            value={card.value}
          />
        </Grid>
      ))}
      <Grid
        size={{
          lg: 8,
          xs: 12,
        }}
      >
        <BreakoutLeaderboard generatedAt={data.generatedAt} symbols={topSymbols.slice(0, 10)} />
      </Grid>
      <Grid
        size={{
          lg: 4,
          xs: 12,
        }}
      >
        <BreakoutScoreBreakdown buckets={scoreBuckets} />
      </Grid>
    </Grid>
  );
}
