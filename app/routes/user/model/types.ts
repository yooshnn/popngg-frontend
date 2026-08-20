import type { ClearMilestone } from '~/entities/medal';
import type { PopnClass } from '~/entities/popn-class';

export interface ClearSummaryValue {
  maxLevel: number;
  achieved: number;
  total: number;
}

export type ClearSummaries = Record<ClearMilestone, ClearSummaryValue>;

export interface UserProfile {
  poptomoId: string;
  name: string;
  avatarUrl: string | null;
  character: string;
  comment: string;
  popnClass: PopnClass;
  legacyPopnClass: PopnClass;
  clearSummaries: ClearSummaries;
  updatedAt: Date;
}
