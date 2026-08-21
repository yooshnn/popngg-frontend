import type { Api } from '~/shared/api';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { userRecordsDtoSchema } from './dto';
import { toUserRecords } from './mapper';

export function userRecordsQuery(userId: string, params: URLSearchParams, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'records', params.toString()] as const,
    placeholderData: keepPreviousData,
    queryFn: async () => toUserRecords(
      await request(`users/${userId}/records`, userRecordsDtoSchema, { searchParams: params }),
    ),
  });
}
