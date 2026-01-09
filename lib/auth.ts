import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = process.env.SESSION_SECRET || 'tierrifilms-secret-key-2024';

export interface SessionUser {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'editor';
}

function signToken(data: string): string {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(data);
  return hmac.digest('hex');
}

function verifyToken(data: string, signature: string): boolean {
  const expectedSignature = signToken(data);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  const encodedPayload = Buffer.from(payload).toString('base64');
  const signature = signToken(encodedPayload);

  return encodedPayload + '.' + signature;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const encodedPayload = parts[0];
    const signature = parts[1];

    if (!verifyToken(encodedPayload, signature)) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64').toString('utf-8')
    );

    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      nome: payload.nome,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie?.value) {
      return null;
    }

    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  return session;
}
