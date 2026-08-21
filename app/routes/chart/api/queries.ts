import type { Api } from '~/shared/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { chartDetailDtoSchema } from './dto';
import { toChartDetail } from './mapper';

export function chartDetailQuery(songHash: string, request: Api = api) {
  return queryOptions({
    queryKey: ['chart', songHash] as const,
    queryFn: async () => toChartDetail(await request(`charts/${songHash}`, chartDetailDtoSchema)),
  });
}
