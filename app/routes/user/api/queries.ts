import type { Api } from '~/shared/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { userProfileDtoSchema } from './dto';
import { toUserProfile } from './mapper';

export function userProfileQuery(userId: string, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'profile'] as const,
    queryFn: async () => toUserProfile(await request(`users/${userId}`, userProfileDtoSchema)),
  });
}
