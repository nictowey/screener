'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface CriterionProps {
  title: string;
  value: string;
  description: string;
}

function Criterion({ title, value, description }: CriterionProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function CriteriaPanel() {
  const criteria: CriterionProps[] = [
    {
      title: 'Revenue Growth',
      value: '> 10% YoY',
      description: 'Companies with accelerating top-line growth that can sustain multi-year expansion.',
    },
    {
      title: 'Earnings Growth',
      value: '> 15% YoY',
      description: 'Strong EPS growth indicates improving profitability and business leverage.',
    },
    {
      title: 'Return on Equity',
      value: '> 10%',
      description: 'High ROE shows the company efficiently generates profits from shareholders\' equity.',
    },
    {
      title: 'Debt / Equity',
      value: '< 2.0',
      description: 'Conservative leverage means less risk during economic downturns.',
    },
    {
      title: 'PEG Ratio',
      value: '< 3.0',
      description: 'Growth at a reasonable price — valuation supported by growth rate.',
    },
    {
      title: 'Price Momentum',
      value: 'Above 50d & 200d MA',
      description: 'Stocks in confirmed uptrends with institutional support.',
    },
    {
      title: 'Market Cap',
      value: '> $2 Billion',
      description: 'Large enough for institutional interest and liquidity, small enough for outsized gains.',
    },
    {
      title: 'Relative Strength',
      value: 'Positive 3m & 6m',
      description: 'Strong recent momentum indicates continued outperformance.',
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Screening Criteria for 2-Year Big Gains
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Each stock is scored on a composite of these fundamentals and momentum signals.
        Higher scores indicate stronger alignment with historically successful multi-year
        growth patterns.
      </Typography>
      <Grid container spacing={2}>
        {criteria.map((c) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={c.title}>
            <Criterion {...c} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
