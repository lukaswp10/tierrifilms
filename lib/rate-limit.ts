// Rate limiting simples em memoria
// Para producao com multiplas instancias, usar Redis/Vercel KV

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, RateLimitEntry>();

// Configuracao
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

export function checkRateLimit(identifier: string): { 
  allowed: boolean; 
  remaining: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = attempts.get(identifier);

  // Limpar entradas expiradas periodicamente
  if (attempts.size > 1000) {
    cleanupExpired();
  }

  if (!entry || now > entry.resetAt) {
    // Primeira tentativa ou janela expirou
    attempts.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    // Limite excedido
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter 
    };
  }

  // Incrementar contador
  entry.count++;
  return { 
    allowed: true, 
    remaining: MAX_ATTEMPTS - entry.count 
  };
}

export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of attempts.entries()) {
    if (now > entry.resetAt) {
      attempts.delete(key);
    }
  }
}

// Helper para extrair IP do request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}
