import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { sessionQueryKey } from '~/entities/session';
import { login } from '../api/login';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
      await navigate('/');
    },
  });
}
