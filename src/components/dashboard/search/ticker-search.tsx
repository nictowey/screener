'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareOut';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { Chart } from '@/components/core/chart';
import {
  findTickerDetails,
  listAvailableTickers,
  type TickerDetails,
  type TickerNewsItem,
  type TickerSummary,
} from '@/lib/tickers';

export interface TickerSearchProps {
  initialSymbol?: string;
  onSelectSymbol?: (symbol: string) => void;
}

const MAX_RESULTS = 8;

const formatCurrency = (value: number, currency: string): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

const formatPercent = (value: number): string => `${value.toFixed(2)}%`;

type NewsSentiment = TickerNewsItem['sentiment'];

const sentimentMeta = (sentiment: NewsSentiment): { label: string; color: 'default' | 'success' | 'error' } => {
  switch (sentiment) {
    case 'positive':
      return { label: 'Positive', color: 'success' };
    case 'negative':
      return { label: 'Negative', color: 'error' };
    default:
      return { label: 'Neutral', color: 'default' };
  }
};

export function TickerSearch({ initialSymbol, onSelectSymbol }: TickerSearchProps): React.JSX.Element {
  const theme = useTheme();
  const availableTickers = React.useMemo<TickerSummary[]>(() => listAvailableTickers(), []);

  const [query, setQuery] = React.useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = React.useState<string>('');
  const [details, setDetails] = React.useState<TickerDetails | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const mountedRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleLoadSymbol = React.useCallback(
    async (symbol: string) => {
      const normalizedSymbol = symbol.trim().toUpperCase();

      if (!normalizedSymbol) {
        return;
      }

      if (mountedRef.current) {
        setLoading(true);
        setError(null);
        setSelectedSymbol(normalizedSymbol);
      }

      try {
        const nextDetails = await findTickerDetails(normalizedSymbol);

        if (!mountedRef.current) {
          return;
        }

        if (!nextDetails) {
          setDetails(null);
          setError('No data was found for the requested ticker.');
          return;
        }

        setDetails(nextDetails);
        onSelectSymbol?.(normalizedSymbol);
      } catch (err) {
        if (!mountedRef.current) {
          return;
        }

        setError('Unable to load the ticker right now. Please try again.');
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [onSelectSymbol],
  );

  React.useEffect(() => {
    const fallbackSymbol = initialSymbol?.trim().toUpperCase() || availableTickers[0]?.symbol;

    if (fallbackSymbol) {
      void handleLoadSymbol(fallbackSymbol);
    }
  }, [availableTickers, handleLoadSymbol, initialSymbol]);

  const filteredTickers = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return availableTickers.slice(0, MAX_RESULTS);
    }

    return availableTickers
      .filter((ticker) =>
        ticker.symbol.toLowerCase().includes(normalizedQuery) || ticker.name.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, MAX_RESULTS);
  }, [availableTickers, query]);

  const breakoutSeries = React.useMemo(() => {
    const data = details?.breakoutHistory ?? [];

    return [
      {
        name: 'Breakout Score',
        data: data.map((point) => point.score),
      },
    ];
  }, [details]);

  const breakoutOptions = React.useMemo<ApexOptions>(() => {
    const categories = details?.breakoutHistory?.map((point) => point.label) ?? [];

    return {
      chart: { background: 'transparent', toolbar: { show: false }, zoom: { enabled: false } },
      colors: [theme.palette.primary.main],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      markers: { size: 4 },
      theme: { mode: theme.palette.mode },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: theme.palette.text.secondary } },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          formatter: (value) => `${Math.round(value)}%`,
          style: { colors: theme.palette.text.secondary },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
    } satisfies ApexOptions;
  }, [details, theme.palette.divider, theme.palette.mode, theme.palette.primary.main, theme.palette.text.secondary]);

  const quoteChangeColor = details && details.quote.change >= 0 ? 'success' : 'error';
  const quoteChangeLabel = details
    ? `${details.quote.change >= 0 ? '+' : ''}${details.quote.change.toFixed(2)} (${formatPercent(details.quote.changePercent)})`
    : '';

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          title="Search tickers"
          subheader="Aggregate price, fundamentals, news, and technical signals in one place."
        />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by ticker or company name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                  </InputAdornment>
                ),
              }}
              label="Ticker search"
            />
            <List disablePadding>
              {filteredTickers.map((ticker) => (
                <ListItem disablePadding key={ticker.symbol}>
                  <ListItemButton
                    onClick={() => {
                      void handleLoadSymbol(ticker.symbol);
                    }}
                    selected={ticker.symbol === selectedSymbol}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Typography variant="subtitle1">{ticker.symbol}</Typography>
                          <Chip label={ticker.sector} size="small" variant="outlined" />
                        </Stack>
                      }
                      secondary={ticker.name}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {filteredTickers.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary={<Typography color="text.secondary">No matches found. Try another symbol.</Typography>}
                  />
                </ListItem>
              ) : null}
            </List>
          </Stack>
        </CardContent>
      </Card>

      {loading ? <LinearProgress color="primary" /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      {details ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader title={`${details.name} (${details.symbol})`} subheader={details.sector} />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography variant="h3">{formatCurrency(details.quote.price, details.quote.currency)}</Typography>
                    <Chip color={quoteChangeColor} label={quoteChangeLabel} size="small" />
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    Updated {dayjs(details.quote.updatedAt).format('MMM D, YYYY h:mm A')}
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Previous close</TableCell>
                        <TableCell align="right">{formatCurrency(details.quote.previousClose, details.quote.currency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Open</TableCell>
                        <TableCell align="right">{formatCurrency(details.quote.open, details.quote.currency)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Day range</TableCell>
                        <TableCell align="right">
                          {formatCurrency(details.quote.low, details.quote.currency)} -{' '}
                          {formatCurrency(details.quote.high, details.quote.currency)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Volume</TableCell>
                        <TableCell align="right">{formatNumber(details.quote.volume)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Stack>
              </CardContent>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <Button
                  component="a"
                  href={`https://www.google.com/finance/quote/${details.symbol}:NASDAQ`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View on Google Finance
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Key fundamentals" />
              <Divider />
              <CardContent>
                <Table size="small">
                  <TableBody>
                    {details.fundamentals.map((item) => (
                      <TableRow key={item.metric} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                        <TableCell>{item.metric}</TableCell>
                        <TableCell align="right">{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Breakout score" subheader="Composite of technical signals" />
              <Divider />
              <CardContent>
                <Chart height={260} options={breakoutOptions} series={breakoutSeries} type="area" width="100%" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Latest news" />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <List disablePadding>
                  {details.news.map((item, index) => {
                    const meta = sentimentMeta(item.sentiment);
                    const showDivider = index !== details.news.length - 1;

                    return (
                      <React.Fragment key={item.id}>
                        <ListItem
                          disablePadding
                          secondaryAction={<Chip color={meta.color} label={meta.label} size="small" variant="outlined" />}
                        >
                          <ListItemButton
                            component={Link}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ alignItems: 'flex-start', py: 2 }}
                          >
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                  <Typography variant="subtitle1">{item.title}</Typography>
                                  <ArrowSquareOutIcon fontSize="var(--icon-fontSize-sm)" />
                                </Stack>
                              }
                              secondary={
                                <Typography color="text.secondary" component="span" variant="body2">
                                  {item.publisher} • {dayjs(item.publishedAt).format('MMM D, YYYY h:mm A')}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                        {showDivider ? <Divider component="li" sx={{ borderColor: alpha(theme.palette.text.primary, 0.08) }} /> : null}
                      </React.Fragment>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body1">
              Select a ticker to view aggregated market intelligence.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}

interface TickerSearchDialogProps extends TickerSearchProps {
  open: boolean;
  onClose: () => void;
}

export function TickerSearchDialog({ open, onClose, initialSymbol, onSelectSymbol }: TickerSearchDialogProps): React.JSX.Element {
  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open} scroll="body">
      <DialogTitle>Search tickers</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ my: 1 }}>
          <TickerSearch
            initialSymbol={initialSymbol}
            onSelectSymbol={(symbol) => {
              onSelectSymbol?.(symbol);
              onClose();
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
