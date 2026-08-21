import type { Api } from '~/shared/api';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { usersDtoSchema } from './dto';
import { toUsers } from './mapper';

export function usersQuery(params: URLSearchParams, request: Api = api) {
  return queryOptions({
    queryKey: ['users', params.toString()] as const,
    placeholderData: keepPreviousData,
    queryFn: async () => toUsers(
      await request('users', usersDtoSchema, { searchParams: params }),
    ),
  });
}
