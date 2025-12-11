import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import muiTheme from '@/theme';

const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

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
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <MuiThemeProvider theme={muiTheme}>
          <App {...props} />
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
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};
