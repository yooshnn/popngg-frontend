import type { Session } from './types';
import { useQuery } from '@tanstack/react-query';
import { sessionQuery } from '../api/session';

export type SessionState
  = | { status: 'pending'; session: null }
    | { status: 'anonymous'; session: null }
    | { status: 'authenticated'; session: Session };

export function useSession(): SessionState {
  const { data, isPending } = useQuery(sessionQuery());

  if (isPending) {
    return { status: 'pending', session: null };
  }

  return data
    ? { status: 'authenticated', session: data }
    : { status: 'anonymous', session: null };
}
