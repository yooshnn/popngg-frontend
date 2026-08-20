import type { ClearSummaries, UserProfile } from '../model/types';
import type { MedalSummaryDto, UserProfileDto } from './dto';
import { clearType } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';

function toClearSummaries(dto: MedalSummaryDto[]): ClearSummaries {
  const summaries = new Map<MedalSummaryDto['kind'], MedalSummaryDto>();

  for (const summary of dto) {
    if (summaries.has(summary.kind)) {
      throw new Error(`Duplicate medal summary for clear milestone: ${summary.kind}`);
    }

    summaries.set(summary.kind, summary);
  }

  return Object.fromEntries(
    clearType.milestones.map((milestone) => {
      const summary = summaries.get(milestone);

      if (!summary) {
        throw new Error(`Missing medal summary for clear milestone: ${milestone}`);
      }

      return [milestone, {
        maxLevel: summary.maxLevel,
        achieved: summary.achieved,
        total: summary.total,
      }];
    }),
  ) as ClearSummaries;
}

export function toUserProfile(dto: UserProfileDto): UserProfile {
  return {
    poptomoId: dto.id,
    name: dto.name,
    avatarUrl: dto.avatarUrl,
    character: dto.character,
    comment: dto.comment,
    popnClass: popnClass.from(dto.popnClass),
    legacyPopnClass: popnClass.from(dto.legacyPopnClass),
    clearSummaries: toClearSummaries(dto.medalSummaries),
    updatedAt: new Date(dto.updatedAt),
  };
}
