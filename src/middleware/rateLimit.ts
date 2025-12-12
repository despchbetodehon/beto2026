
import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60000; // 1 minuto
const MAX_REQUESTS = 100; // 100 requisições por minuto

export function rateLimit(req: NextRequest): boolean {
  const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const ip = ipHeader ? ipHeader.split(',')[0].trim() : 'unknown';
  const now = Date.now();
  
  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS
    };
    return true;
  }
  
  if (store[ip].count >= MAX_REQUESTS) {
    return false;
  }
  
  store[ip].count++;
  return true;
}

// Limpar dados antigos a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(ip => {
    if (now > store[ip].resetTime + WINDOW_MS) {
      delete store[ip];
    }
  });
}, 300000);
