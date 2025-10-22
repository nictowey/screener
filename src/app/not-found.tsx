import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';

export const metadata = { title: `Not found | ${config.site.name}` } satisfies Metadata;

export default function NotFound(): React.JSX.Element {
  return (
    <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
      <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
        <Box>
          <Box
            component="svg"
            role="img"
            aria-label="404 not found"
            viewBox="0 0 400 260"
            sx={{
              display: 'inline-block',
              height: 'auto',
              maxWidth: '100%',
              width: '400px',
            }}
          >
            <defs>
              <linearGradient id="nf-gradient-root" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <rect fill="url(#nf-gradient-root)" height="260" rx="24" width="400" />
            <g fill="#f8fafc" fontFamily="'Inter', system-ui, sans-serif">
              <text fontSize="120" fontWeight="700" x="44" y="160">
                404
              </text>
              <text fontSize="24" fontWeight="500" x="44" y="204">
                Page not found
              </text>
            </g>
            <circle cx="320" cy="84" fill="#f8fafc" opacity="0.2" r="36" />
            <circle cx="280" cy="200" fill="#f8fafc" opacity="0.12" r="28" />
          </Box>
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          404: The page you are looking for isn&apos;t here
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
        </Typography>
        <Button
          component={RouterLink}
          href={paths.home}
          startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
        >
          Go back to home
        </Button>
      </Stack>
    </Box>
  );
}
