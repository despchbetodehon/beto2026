import '@/polyfills';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GlobalStyles as MuiGlobalStyles, Box } from '@mui/material';
import { AutenticacaoProvider } from '@/data/contexts/AutenticacaoContext';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import { AUTHORSHIP, SIGNATURE } from '@/metadata/authorship';
import { __METADATA__ as HIDDEN_SIG, verify } from '@/metadata/signature';

import MenuTopBeto from '@/components/home/home';

import '@/styles/globals.css';

import muiTheme from '@/theme';

// Dynamic imports
const Particles = dynamic(() => import('@/components/landing/particles'), {
  ssr: false,
  loading: () => null
});

// Global styles using MUI's GlobalStyles to avoid theme conflicts
const globalStyles = {
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  html: {
    width: '100%',
    minHeight: '100vh',
  },
  body: {
    width: '100%',
    minHeight: '100vh',
    fontFamily: "'Montserrat', 'Poppins', 'Segoe UI', 'Roboto', Arial, sans-serif",
    transition: 'background-color 0.3s, color 0.3s',
    overflowX: 'hidden',
  },
  '#__next': {
    width: '100%',
    minHeight: '100vh',
  },
  'img, video, iframe, embed, object': {
    maxWidth: '100% !important',
    height: 'auto !important',
  },
};

// Inner component that uses theme-safe MUI v5 styling (sx)
function AppContent({ Component, pageProps }: { Component: AppProps['Component'], pageProps: AppProps['pageProps'] }) {
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
      <Box sx={{ minHeight: '100vh', pb: '30px', overflowX: 'hidden', backgroundColor: 'inherit' }}>
        <Component {...pageProps} />
      </Box>
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
        <CssBaseline />
        <MuiGlobalStyles styles={globalStyles} />
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AutenticacaoProvider>

            <AppContent Component={Component} pageProps={pageProps} />

            {/* <ChatFlutuante /> - Temporariamente desabilitado */}

          </AutenticacaoProvider>
        </MantineProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;