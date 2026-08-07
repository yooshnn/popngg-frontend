import type { Role, Session } from '../model/types';
import { http } from '~/shared/api';

export interface SessionDto {
  user: { id: string; name: string } | null;
  role: Role | null;
}

export function toSession({ user, role }: SessionDto): Session | null {
  return user && role ? { ...user, role } : null;
}

export const sessionQueryKey = ['session'] as const;

/** Browser-only. */
export function sessionQuery() {
  const request = http();

  return {
    queryKey: sessionQueryKey,
    queryFn: async () => toSession(await request<SessionDto>('auth/session')),
  };
}
