import { z } from 'zod';
import { api } from '~/shared/api';

const logoutResponseSchema = z.null();

export function logout(): Promise<null> {
  return api('auth/logout', logoutResponseSchema, {
    method: 'post',
  });
}
