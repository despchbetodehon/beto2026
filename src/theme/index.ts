import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2d5a3d',
    },
    secondary: {
      main: '#5d8f6c',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", serif',
  },
});

export default muiTheme;
