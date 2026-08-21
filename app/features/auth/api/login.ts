import { z } from 'zod';
import { api } from '~/shared/api';
import { hashPassword } from '../model/validation';

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
