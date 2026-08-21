import type { Difficulty } from '~/entities/difficulty';
import type { Medal } from '~/entities/medal';
import type { PopnClass } from '~/entities/popn-class';
import type { PopnVersion } from '~/entities/popn-version';
import type { Rank } from '~/entities/rank';
import type { Score } from '~/entities/score';
import type { Page } from '~/shared/api';

export interface UserRecord {
  id: string;
  title: string;
  genre: string;
  bannerUrl: string;
  version: PopnVersion;
  difficulty: Difficulty;
  level: number;
  medal: Medal;
  rank: Rank;
  score: Score;
  popnClass: PopnClass;
}

export type UserRecords = Page<UserRecord>;
