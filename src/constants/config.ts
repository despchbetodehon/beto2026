/**
 * Constantes de aplicação
 * Centraliza magic strings e números
 */

export const APP_CONFIG = {
  // Paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // Timeouts
  TIMEOUT: {
    API_REQUEST: 30000,
    DEBOUNCE: 500,
    NOTIFICATION_DURATION: 5000,
  },

  // Cache
  CACHE: {
    DURATION: 5 * 60 * 1000, // 5 minutos
  },

  // Validações
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 100,
    MAX_EMAIL_LENGTH: 255,
  },

  // Rotas
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/beto',
    COLABORADORES: '/colaboradores',
    ANALISES: '/analises',
    EXPORT: '/export',
  },

  // Status
  STATUS: {
    PENDING: 'Pendente',
    IN_PROGRESS: 'Em Andamento',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  },
};

export const COLORS = {
  PRIMARY: '#1a4d3a',
  SECONDARY: '#2d5a3d',
  DANGER: '#d32f2f',
  WARNING: '#f57c00',
  SUCCESS: '#388e3c',
  INFO: '#1976d2',
};

export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1264,
  XL: 1904,
};
