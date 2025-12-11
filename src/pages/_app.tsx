import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle, DefaultTheme } from 'styled-components';
import { AutenticacaoProvider } from '@/data/contexts/AutenticacaoContext';
import { MantineProvider } from '@mantine/core';
import { makeStyles, ThemeProvider as StylesThemeProvider } from '@mui/styles';
import { ThemeProvider as MuiThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import { AUTHORSHIP, SIGNATURE } from '@/metadata/authorship';
import { __METADATA__ as HIDDEN_SIG, verify } from '@/metadata/signature';

import MenuTopBeto from '@/components/home/home';

import '@/styles/globals.css';

// Create a default theme directly here to ensure it's always available
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
    error: {
      main: '#dc3545',
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Crimson Text", "Libre Baskerville", "Georgia", serif',
  },
  spacing: (factor: number) => `${8 * factor}px`, // MUI default spacing: 8px base unit
  shape: {
    borderRadius: 4,
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  mixins: {
    toolbar: {
      minHeight: 56,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
});

// Dynamic imports
const Particles = dynamic(() => import('@/components/landing/particles'), {
  ssr: false,
  loading: () => null
});

// Temas
const lightTheme: DefaultTheme = {
  backgroundColor: '#f4f6fa',
  textColor: '#222',
};

const darkTheme: DefaultTheme = {
  backgroundColor: '#15161a',
  textColor: '#fafafa',
};

// Estilo global corrigido
const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    background-color: ${(props: any) => props.theme.backgroundColor};
    color: ${(props: any) => props.theme.textColor};
    font-family: 'Montserrat', 'Poppins', 'Segoe UI', 'Roboto', Arial, sans-serif;
    transition: background-color 0.3s, color 0.3s;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  #__next {
    min-height: 100vh;
    width: 100%;
  }

  img, video, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
  }
`;

// Estilos com makeStyles
const useStyles = makeStyles(() => ({
  mainWrapper: {
    minHeight: '100vh',
    paddingBottom: '30px',
    overflowX: 'hidden',
    backgroundColor: 'inherit',
  },
}));

// Inner component that uses styles (must be inside ThemeProvider)
function AppContent({ Component, pageProps }: { Component: AppProps['Component'], pageProps: AppProps['pageProps'] }) {
  const classes = useStyles();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR flash - wait for client-side hydration
  if (!mounted) {
    return null;
  }
  
  return (
    <>
      <MenuTopBeto />
      <div className={classes.mainWrapper}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Registrar autoria do sistema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar integridade
      const isValid = verify();
      if (!isValid) {
        console.warn('⚠️ Assinatura digital inválida');
      }

      // Logs de desenvolvimento
      console.log('​', AUTHORSHIP);
      console.log('​‌‍', HIDDEN_SIG);

      // Marcar no objeto window (não aparece em Object.keys())
      Object.defineProperty(window, '__AUTHORSHIP__', {
        value: AUTHORSHIP,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(window, '__HIDDEN_SIGNATURE__', {
        value: HIDDEN_SIG,
        writable: false,
        enumerable: false,
        configurable: false
      });

      // Proteção adicional
      Object.freeze(AUTHORSHIP);
      Object.freeze(HIDDEN_SIG);
    }
  }, []);

  // O interceptor de fetch foi removido pois estava causando conflitos com requisições legítimas
  // e com o Firestore. As respostas devem ser manipuladas pelo código que as chama.


  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={muiTheme}>
        <StylesThemeProvider theme={muiTheme}>
          <CssBaseline />
          <StyledThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles />
            <MantineProvider withGlobalStyles withNormalizeCSS>
              <AutenticacaoProvider>

                <AppContent Component={Component} pageProps={pageProps} />

                {/* <ChatFlutuante /> - Temporariamente desabilitado */}

              </AutenticacaoProvider>
            </MantineProvider>
          </StyledThemeProvider>
        </StylesThemeProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;