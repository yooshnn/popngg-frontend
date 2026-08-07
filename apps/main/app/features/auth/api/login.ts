import type { SessionDto } from '~/entities/session';
import { toSession } from '~/entities/session';
import { http } from '~/shared/api';

export interface LoginPayload {
  poptomoId: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const session = toSession(await http()<SessionDto>('auth/login', { method: 'post', json: payload }));

  if (!session) {
    throw new Error('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
  }

  return session;
}
