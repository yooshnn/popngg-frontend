import { isHTTPError } from 'ky';
import { z } from 'zod';
import { sessionSchema, toSession } from '~/entities/session';
import { api } from '~/shared/api';
import { hashPassword } from '../model/validation';

export interface RegisterPayload {
  poptomoId: string;
  password: string;
  isPrivate: boolean;
}

export async function register({ poptomoId, password, isPrivate }: RegisterPayload) {
  const session = toSession(await api('auth/register', sessionSchema, {
    method: 'post',
    json: {
      poptomoId,
      password: await hashPassword(password),
      isPrivate,
    },
  }));

  if (!session) {
    throw new Error('가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
  }

  return session;
}

export async function isRegistered(poptomoId: string) {
  try {
    await api(`users/${poptomoId}`, z.unknown());
    return true;
  }
  catch (error) {
    if (isHTTPError(error) && error.response.status === 404) {
      return false;
    }
    throw error;
  }
}
