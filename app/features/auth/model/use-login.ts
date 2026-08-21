import type { LoginPayload } from '../api/login';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { sessionQuery } from '~/entities/session';
import { login } from '../api/login';
import { rememberedIdCookie } from './remembered-id';

export interface LoginVariables extends LoginPayload {
  remember: boolean;
}

export interface UseLoginOptions {
  redirectTo: string | null;
}

export function useLogin({ redirectTo }: UseLoginOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poptomoId, password }: LoginVariables) => login({ poptomoId, password }),
    onSuccess: async (_, { remember }) => {
      const session = await queryClient.fetchQuery(sessionQuery());

      if (!session) {
        throw new Error('로그인에 성공했지만 세션을 확인할 수 없습니다.');
      }

      await (remember ? rememberedIdCookie.write(session.id) : rememberedIdCookie.clear());

      if (redirectTo !== null) {
        await navigate(redirectTo);
      }
    },
  });
}
