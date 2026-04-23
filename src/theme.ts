import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8c72d0',
      dark: '#491eb7',
      light: '#a994de',
      contrastText: '#fbfbfb',
    },
    background: {
      default: '#0f0a1f',
      paper: '#1a1430',
    },
    text: {
      primary: '#fbfbfb',
      secondary: '#c9beec',
    },
    divider: 'rgba(169, 148, 222, 0.12)',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Inter',
      'system-ui',
      '-apple-system',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(26, 20, 48, 0.72)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(169, 148, 222, 0.08)',
          transition:
            'border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
