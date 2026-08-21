import type { BestLevels, Users, UserSummary } from '../model/types';
import type { BestLevelDto, UsersDto, UserSummaryDto } from './dto';
import { clearType } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';

function toBestLevels(dtos: BestLevelDto[]): BestLevels {
  const levels = new Map(dtos.map(level => [level.kind, level.maxLevel]));

  return Object.fromEntries(
    clearType.milestones.map((milestone) => {
      if (!levels.has(milestone)) {
        throw new Error(`Missing best level for clear milestone: ${milestone}`);
      }

      return [milestone, levels.get(milestone)!];
    }),
  ) as BestLevels;
}

function toUserSummary(dto: UserSummaryDto): UserSummary {
  return {
    poptomoId: dto.id,
    name: dto.name,
    avatarUrl: dto.avatarUrl,
    comment: dto.comment,
    rank: dto.rank,
    popnClass: popnClass.from(dto.popnClass),
    bestLevels: toBestLevels(dto.bestLevels),
    updatedAt: new Date(dto.updatedAt),
  };
}

export function toUsers(dto: UsersDto): Users {
  return {
    ...dto,
    items: dto.items.map(toUserSummary),
  };
}
