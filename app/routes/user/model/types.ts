import type { ClearMilestone } from '~/entities/medal';
import type { PopnClass } from '~/entities/popn-class';

export interface ClearSummaryValue {
  maxLevel: number;
  achieved: number;
  total: number;
}

export type ClearSummaries = Record<ClearMilestone, ClearSummaryValue>;

export interface Credits {
  normal: number;
  extra: number;
  timePlay10: number;
  timePlay16: number;
}

export interface UserProfile {
  poptomoId: string;
  name: string;
  avatarUrl: string | null;
  character: string;
  comment: string;
  hidden: boolean;
  popnClass: PopnClass;
  potentialPopnClass: PopnClass;
  legacyPopnClass: PopnClass;
  credits: Credits;
  clearSummaries: ClearSummaries;
  updatedAt: Date;
}
