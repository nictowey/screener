import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';

export interface BreakoutStatsCardProps {
  title: string;
  value: string;
  caption?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: React.JSX.Element;
  sx?: SxProps;
}

export function BreakoutStatsCard({
  caption,
  icon,
  sx,
  title,
  trend,
  trendValue,
  value,
}: BreakoutStatsCardProps): React.JSX.Element {
  const TrendIcon = trend === 'down' ? ArrowDownIcon : ArrowUpIcon;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            {icon ? (
              <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
                {icon}
              </Avatar>
            ) : null}
          </Stack>
          {trendValue ? (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TrendIcon
                color={trend === 'down' ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-success-main)'}
                fontSize="var(--icon-fontSize-md)"
              />
              <Typography
                color={trend === 'down' ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-success-main)'}
                variant="body2"
              >
                {trendValue}
              </Typography>
              {caption ? (
                <Typography color="text.secondary" variant="caption">
                  {caption}
                </Typography>
              ) : null}
            </Stack>
          ) : caption ? (
            <Typography color="text.secondary" variant="caption">
              {caption}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
