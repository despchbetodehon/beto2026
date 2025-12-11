/**
 * Configuração de Next.js otimizada para performance
 */

module.exports = {
  // Compression
  compress: true,

  // Image optimization
  images: {
    domains: ['firebasestorage.googleapis.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          enabled: process.env.ANALYZE === 'true',
          openAnalyzer: true,
          analyzerMode: 'server',
          reportFilename: 'bundle-report.html',
        })
      );
    }
    return config;
  },

  // Experimental features
  experimental: {
    // optimizePackageImports para reduzir bundle size
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'date-fns',
      'lodash',
    ],
  },

  // Headers para cache
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000', // 30 dias
          },
        ],
      },
    ];
  },

  // Redirects para rotas antigas
  async redirects() {
    return [
      // Adicionar aqui redirecionamentos necessários
    ];
  },
};
