import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              Welcome to{' '}
              <Box component="span" sx={{ color: '#15b79e' }}>
                Devias Kit
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1">
              A professional template that comes with ready-to-use MUI components.
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="svg"
              aria-label="Widget preview"
              role="img"
              viewBox="0 0 720 420"
              sx={{ height: 'auto', width: '100%', maxWidth: '600px' }}
            >
              <defs>
                <linearGradient id="auth-widget-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              <rect fill="url(#auth-widget-gradient)" height="420" rx="36" width="720" opacity="0.9" />
              <rect fill="#0f172a" height="320" rx="24" width="640" x="40" y="48" opacity="0.92" />
              <rect fill="#1f2937" height="80" rx="18" width="520" x="100" y="96" opacity="0.75" />
              <rect fill="#1f2937" height="80" rx="18" width="520" x="100" y="204" opacity="0.55" />
              <rect fill="#1f2937" height="80" rx="18" width="320" x="100" y="312" opacity="0.45" />
              <circle cx="560" cy="156" fill="#22d3ee" r="36" opacity="0.75" />
              <circle cx="600" cy="264" fill="#a855f7" r="28" opacity="0.75" />
              <circle cx="520" cy="348" fill="#38bdf8" r="24" opacity="0.65" />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
