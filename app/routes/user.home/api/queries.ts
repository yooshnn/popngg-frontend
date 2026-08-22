import type { Api } from '~/shared/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '~/shared/api';
import { currentPopnClassTargetsDtoSchema, legacyPopnClassTargetsDtoSchema, levelStatsListDtoSchema } from './dto';
import { toCurrentPopnClassTargets, toLegacyPopnClassTargets, toLevelStats } from './mapper';

export function currentPopnClassTargetsQuery(userId: string, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'popn-class-targets', 'current'] as const,
    queryFn: async () => toCurrentPopnClassTargets(
      await request(`users/${userId}/popn-class-targets/current`, currentPopnClassTargetsDtoSchema),
    ),
  });
}

export function potentialPopnClassTargetsQuery(userId: string, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'popn-class-targets', 'potential'] as const,
    queryFn: async () => toCurrentPopnClassTargets(
      await request(`users/${userId}/popn-class-targets/potential`, currentPopnClassTargetsDtoSchema),
    ),
  });
}

export function legacyPopnClassTargetsQuery(userId: string, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'popn-class-targets', 'legacy'] as const,
    queryFn: async () => toLegacyPopnClassTargets(
      await request(`users/${userId}/popn-class-targets/legacy`, legacyPopnClassTargetsDtoSchema),
    ),
  });
}

export function levelStatsQuery(userId: string, request: Api = api) {
  return queryOptions({
    queryKey: ['user', userId, 'level-stats'] as const,
    queryFn: async () => toLevelStats(await request(`users/${userId}/level-stats`, levelStatsListDtoSchema)),
  });
}
