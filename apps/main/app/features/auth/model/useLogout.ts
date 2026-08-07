import type { Session } from '~/entities/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionQueryKey } from '~/entities/session';
import { logout } from '../api/logout';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData<Session | null>(sessionQueryKey, null);
    },
  });
}
