import { http } from '~/shared/api';

export function logout() {
  return http()<void>('auth/logout', { method: 'post' });
}
