import { z } from 'zod';
import { api } from '~/shared/api';

export interface LoginPayload {
  poptomoId: string;
  password: string;
}

const loginResponseSchema = z.null();

export async function login({ poptomoId, password }: LoginPayload): Promise<null> {
  return api('auth/login', loginResponseSchema, {
    method: 'post',
    json: {
      poptomoId,
      password: await hashPassword(password),
    },
  });
}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
