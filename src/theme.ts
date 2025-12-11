import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2d5a3d',
      light: '#4a7c59',
      dark: '#1a4d3a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5d8f6c',
      light: '#7da688',
      dark: '#3e6b4a',
      contrastText: '#fff',
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
});

export default muiTheme;
