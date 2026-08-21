import type { Api } from '~/shared/api';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { chartsDtoSchema } from './dto';
import { toCharts } from './mapper';

export function chartsQuery(params: URLSearchParams, request: Api = api) {
  return queryOptions({
    queryKey: ['charts', params.toString()] as const,
    placeholderData: keepPreviousData,
    queryFn: async () => toCharts(
      await request('charts', chartsDtoSchema, { searchParams: params }),
    ),
  });
}
