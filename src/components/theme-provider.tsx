'use client';

import { ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4fc3f7' },
    secondary: { main: '#81c784' },
    background: {
      default: '#0a0e17',
      paper: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 12 },
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
