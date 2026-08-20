import { parseAsInteger, parseAsStringLiteral } from 'nuqs';
import { LEVEL_STATS_MODES } from './level-stats';

export const levelStatsSearchParams = {
  mode: parseAsStringLiteral(LEVEL_STATS_MODES).withDefault('medal'),
  level: parseAsInteger,
};
