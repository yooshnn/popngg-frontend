import type { ClearMilestone } from '~/entities/medal';
import type { PopnClass } from '~/entities/popn-class';
import type { Page } from '~/shared/api';

export type BestLevels = Record<ClearMilestone, number | null>;

export interface UserSummary {
  poptomoId: string;
  name: string;
  avatarUrl: string | null;
  comment: string;
  rank: number;
  popnClass: PopnClass;
  bestLevels: BestLevels;
  updatedAt: Date;
}

export type Users = Page<UserSummary>;
