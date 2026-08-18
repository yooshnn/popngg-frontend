import type { Session } from './types';
import { useQuery } from '@tanstack/react-query';
import { sessionQuery } from '../api/session';

export type SessionState
  = | { status: 'pending'; session: null; error: null }
    | { status: 'anonymous'; session: null; error: null }
    | { status: 'authenticated'; session: Session; error: null }
    | { status: 'error'; session: null; error: Error };

export function useSession(): SessionState {
  const { data, error, isPending } = useQuery(sessionQuery());

  if (isPending) {
    return { status: 'pending', session: null, error: null };
  }

  if (error) {
    return { status: 'error', session: null, error };
  }

  return data
    ? { status: 'authenticated', session: data, error: null }
    : { status: 'anonymous', session: null, error: null };
}
