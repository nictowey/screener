'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';
import type { BreakoutScoreBucket } from '@/services/breakout';

export interface BreakoutScoreBreakdownProps {
  buckets: BreakoutScoreBucket[];
}

export function BreakoutScoreBreakdown({ buckets }: BreakoutScoreBreakdownProps): React.JSX.Element {
  const theme = useTheme();
  const chartOptions = React.useMemo<ApexOptions>(() => {
    const palette = [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      alpha(theme.palette.primary.main, 0.65),
    ];

    return {
      chart: { background: 'transparent' },
      colors: palette,
      dataLabels: { enabled: false },
      labels: buckets.map((bucket) => bucket.label),
      legend: { position: 'bottom', labels: { colors: theme.palette.text.secondary } },
      plotOptions: { pie: { expandOnClick: false } },
      stroke: { width: 0 },
      theme: { mode: theme.palette.mode },
    } satisfies ApexOptions;
  }, [buckets, theme]);

  const total = React.useMemo(() => buckets.reduce((sum, item) => sum + item.value, 0), [buckets]);

  return (
    <Card>
      <CardHeader title="Score breakdown" subheader="Distribution of composite breakout scores" />
      <CardContent>
        {buckets.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No score data available.
          </Typography>
        ) : (
          <Stack spacing={3}>
            <Chart
              height={320}
              options={chartOptions}
              series={buckets.map((bucket) => bucket.value)}
              type="donut"
              width="100%"
            />
            <Stack spacing={1}>
              <Typography variant="subtitle2">Total candidates</Typography>
              <Typography variant="h4">{total}</Typography>
              <Stack spacing={1}>
                {buckets.map((bucket) => (
                  <Stack direction="row" key={bucket.label} spacing={1} sx={{ justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" variant="body2">
                      {bucket.label}
                    </Typography>
                    <Typography variant="body2">{bucket.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
