import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import type { BreakoutSymbol } from '@/services/breakout';

dayjs.extend(relativeTime);

export interface BreakoutLeaderboardProps {
  generatedAt: string;
  symbols: BreakoutSymbol[];
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export function BreakoutLeaderboard({ generatedAt, symbols }: BreakoutLeaderboardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader
        subheader={`Last updated ${dayjs(generatedAt).fromNow()}`}
        title="Breakout leaderboard"
      />
      <CardContent sx={{ px: 0 }}>
        {symbols.length === 0 ? (
          <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', py: 6 }}>
            <Typography color="text.secondary" variant="body2">
              No breakout candidates found for the selected window.
            </Typography>
          </Stack>
        ) : (
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="5%">#</TableCell>
                  <TableCell width="20%">Symbol</TableCell>
                  <TableCell width="25%">Company</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">% Change</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell width="15%">Pattern</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {symbols.map((item, index) => (
                  <TableRow hover key={item.symbol}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">{item.symbol}</Typography>
                        <Typography color="text.secondary" variant="caption">
                          RS: {item.relativeStrength}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary" variant="body2">
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip color="primary" label={item.score.toFixed(0)} size="small" variant="soft" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={item.changePercent >= 0 ? 'success.main' : 'error.main'} variant="body2">
                        {item.changePercent >= 0 ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{numberFormatter.format(item.volume)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary" variant="body2">
                        {item.basePattern || '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
