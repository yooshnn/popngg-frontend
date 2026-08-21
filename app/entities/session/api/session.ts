import type { Session } from '../model/types';
import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '~/shared/api';

export const sessionSchema = z.object({
  poptomoId: z.string(),
  userName: z.string(),
  avatarUrl: z.string().nullable(),
}).nullable();

export type SessionDto = z.output<typeof sessionSchema>;

export const sessionQueryKey = ['session'] as const;

export function toSession(session: SessionDto): Session | null {
  return session
    ? {
        id: session.poptomoId,
        name: session.userName,
        avatarUrl: session.avatarUrl,
      }
    : null;
}

export function sessionQuery() {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: async () => toSession(await api('auth/session', sessionSchema)),
    staleTime: 0,
    enabled: !import.meta.env.SSR,
  });
}
