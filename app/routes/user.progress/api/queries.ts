import type { ProgressAxis } from '../model/types';
import type { Api } from '~/shared/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { progressDtoSchema } from './dto';
import { toProgress } from './mapper';

export function progressQuery(userId: string, axis: ProgressAxis, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'progress', axis] as const,
    queryFn: async () => toProgress(
      await request(`users/${userId}/progress`, progressDtoSchema, {
        searchParams: new URLSearchParams({ by: axis }),
      }),
    ),
  });
}
