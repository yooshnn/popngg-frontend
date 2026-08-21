import type { RegisterPayload } from '../api/register';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { sessionQueryKey } from '~/entities/session';
import { register } from '../api/register';
import { rememberedIdCookie } from './remembered-id';

export interface UseRegisterOptions {
  redirectTo?: string | null;
}

export function useRegister({ redirectTo = '/' }: UseRegisterOptions = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: async (session) => {
      queryClient.setQueryData(sessionQueryKey, session);
      await rememberedIdCookie.write(session.id);

      if (redirectTo !== null) {
        await navigate(redirectTo);
      }
    },
  });
}
