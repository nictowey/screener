'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TrendUp } from '@phosphor-icons/react';

export default function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendUp size={28} weight="bold" color="#4fc3f7" />
          <Typography variant="h6" fontWeight={700}>
            Daily Stock Picker
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
          2-Year Growth Screener
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
