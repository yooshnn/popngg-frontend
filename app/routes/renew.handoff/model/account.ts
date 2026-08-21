import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { isRegistered } from '~/features/auth';

export type AccountLookup = 'pending' | 'registered' | 'unregistered' | 'error';

export function useAccountLookup(gameId: string | null): AccountLookup {
  const query = useQuery({
    queryKey: ['registered', gameId],
    queryFn: () => isRegistered(gameId!),
    enabled: gameId !== null,
  });

  return useMemo(() => {
    if (query.isError) {
      return 'error';
    }
    if (query.isPending) {
      return 'pending';
    }
    return query.data ? 'registered' : 'unregistered';
  }, [query.isError, query.isPending, query.data]);
}
