import type { Medal } from '~/entities/medal';
import type { Rank } from '~/entities/rank';
import { tableFields, writeBinding } from '~/features/table';

type LevelStatsSelection
  = | { kind: 'medal'; values: readonly Medal[] }
    | { kind: 'rank'; values: readonly Rank[] };

/** The user.records URL for one level's worth of medals or ranks, in the same shape its own filter form writes. */
export function recordsLink(userId: string, level: number, selection: LevelStatsSelection): string {
  const params = new URLSearchParams();

  writeBinding(params, tableFields.level.binding, { min: level, max: level });

  if (selection.kind === 'medal') {
    writeBinding(params, tableFields.medal.binding, selection.values);
  }
  else {
    writeBinding(params, tableFields.rank.binding, selection.values);
  }

  return `/user/${userId}/records?${params}`;
}
