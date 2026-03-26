'use client';

import { useCallback, useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import CriteriaPanel from '@/components/criteria-panel';
import Header from '@/components/header';
import InstallPrompt from '@/components/install-prompt';
import PicksTable from '@/components/picks-table';
import type { StockPick } from '@/lib/screener';

interface PicksResponse {
  picks: StockPick[];
  generatedAt: string;
  totalScreened: number;
  cached: boolean;
  error?: string;
}

export default function HomePage() {
  const [data, setData] = useState<PicksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPicks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/picks');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json: PicksResponse = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch picks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPicks();
  }, [fetchPicks]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <InstallPrompt />
        {/* Title section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Today&apos;s Top Stock Picks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stocks screened from a universe of 200+ tickers for maximum 2-year
            growth potential. Updated multiple times daily using live market data.
          </Typography>
          {data && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Last updated: {dayjs(data.generatedAt).format('MMM D, YYYY h:mm A')} &middot;{' '}
              {data.totalScreened} stocks screened &middot;{' '}
              {data.cached ? 'Cached result' : 'Fresh scan'}
            </Typography>
          )}
        </Box>

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
            <CircularProgress size={48} />
            <Typography color="text.secondary">
              Screening 200+ stocks against growth criteria...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This may take 1-2 minutes on first load
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={fetchPicks}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Results */}
        {!loading && data && (
          <>
            <PicksTable picks={data.picks} />

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Hover over any row to see why it was selected. Scores range from 0-100.
            </Typography>

            <Divider sx={{ my: 5 }} />

            <CriteriaPanel />

            <Divider sx={{ my: 5 }} />

            {/* Disclaimer */}
            <Alert severity="warning" variant="outlined" sx={{ mb: 4 }}>
              <Typography variant="caption">
                <strong>Disclaimer:</strong> This screener is for informational and educational
                purposes only. It does not constitute investment advice. Past performance and
                screening criteria do not guarantee future results. Always do your own research
                and consult a licensed financial advisor before making investment decisions.
              </Typography>
            </Alert>

            <Box sx={{ textAlign: 'center', pb: 4 }}>
              <Button variant="outlined" onClick={fetchPicks} disabled={loading}>
                Refresh Picks
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
