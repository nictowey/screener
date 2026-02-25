'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { StockPick } from '@/lib/screener';

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`;
  return `$${cap.toFixed(0)}`;
}

function formatPct(val: number): string {
  const sign = val >= 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

function ScoreBadge({ score }: { score: number }) {
  let color: 'success' | 'warning' | 'info' = 'info';
  let label = 'Good';
  if (score >= 70) { color = 'success'; label = 'Strong Buy'; }
  else if (score >= 50) { color = 'success'; label = 'Buy'; }
  else if (score >= 35) { color = 'warning'; label = 'Watch'; }
  return <Chip size="small" color={color} label={`${score} — ${label}`} />;
}

interface Props {
  picks: StockPick[];
}

export default function PicksTable({ picks }: Props) {
  if (picks.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No stocks passed the screening criteria today. Check back later.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Sector</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Mkt Cap</TableCell>
            <TableCell align="right">Rev Growth</TableCell>
            <TableCell align="right">EPS Growth</TableCell>
            <TableCell align="right">ROE</TableCell>
            <TableCell align="right">D/E</TableCell>
            <TableCell align="right">PEG</TableCell>
            <TableCell align="right">3m RS</TableCell>
            <TableCell align="right">6m RS</TableCell>
            <TableCell align="right">1y RS</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {picks.map((pick, idx) => (
            <Tooltip
              key={pick.symbol}
              title={
                <Box sx={{ maxWidth: 320 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Why {pick.symbol}?
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {pick.reasons.map((r, i) => (
                      <li key={i}>
                        <Typography variant="caption">{r}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              }
              arrow
              placement="bottom-start"
            >
              <TableRow
                hover
                sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <Typography fontWeight={700} color="primary">
                    {pick.symbol}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                    {pick.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={pick.sector} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">${pick.price.toFixed(2)}</TableCell>
                <TableCell align="right">{formatMarketCap(pick.marketCap)}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: pick.revenueGrowth >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatPct(pick.revenueGrowth)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: pick.earningsGrowth >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatPct(pick.earningsGrowth)}
                </TableCell>
                <TableCell align="right">{pick.returnOnEquity.toFixed(1)}%</TableCell>
                <TableCell align="right">{pick.debtToEquity.toFixed(2)}</TableCell>
                <TableCell align="right">
                  {pick.pegRatio < 100 ? pick.pegRatio.toFixed(2) : 'N/A'}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: pick.relativeStrength3m >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatPct(pick.relativeStrength3m)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: pick.relativeStrength6m >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatPct(pick.relativeStrength6m)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: pick.relativeStrength1y >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatPct(pick.relativeStrength1y)}
                </TableCell>
                <TableCell align="center">
                  <ScoreBadge score={pick.compositeScore} />
                </TableCell>
              </TableRow>
            </Tooltip>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
