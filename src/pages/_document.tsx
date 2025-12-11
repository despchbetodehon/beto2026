import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheets, ThemeProvider } from '@mui/styles';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

// Create emotion cache
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

// Create the same theme used in _app.tsx for SSR
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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
   
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Cinzel:400,700|Roboto:300,400,500,700&display=swap"
          />
          <link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap"
  rel="stylesheet"
/>

        </Head>
        <body suppressHydrationWarning={true}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={muiTheme}>
            <App {...props} />
          </ThemeProvider>
        </MuiThemeProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  
  // Extract emotion styles
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
      ...emotionStyleTags,
    ],
  };
};
