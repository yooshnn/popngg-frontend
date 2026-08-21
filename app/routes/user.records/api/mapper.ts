import type { UserRecord, UserRecords } from '../model/types';
import type { UserRecordDto, UserRecordsDto } from './dto';
import { difficulty } from '~/entities/difficulty';
import { medal } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';
import { popnVersion } from '~/entities/popn-version';
import { rank } from '~/entities/rank';

export function toUserRecords(dto: UserRecordsDto): UserRecords {
  return {
    ...dto,
    items: dto.items.map(toUserRecord),
  };
}

function toUserRecord(dto: UserRecordDto): UserRecord {
  const difficultyValue = difficulty.from(dto.difficulty);
  const medalValue = medal.from(dto.medal);
  const rankValue = rank.from(dto.rank);
  const versionValue = popnVersion.from(dto.version);

  if (!difficultyValue) {
    throw new Error(`Unknown difficulty code in record ${dto.id}: ${dto.difficulty}`);
  }

  if (!medalValue) {
    throw new Error(`Unknown medal code in record ${dto.id}: ${dto.medal}`);
  }

  if (!rankValue) {
    throw new Error(`Unknown rank code in record ${dto.id}: ${dto.rank}`);
  }

  if (!versionValue) {
    throw new Error(`Unknown pop'n version code in record ${dto.id}: ${dto.version}`);
  }

  return {
    id: dto.id,
    title: dto.title,
    genre: dto.genre,
    bannerUrl: dto.bannerUrl,
    version: versionValue,
    difficulty: difficultyValue,
    level: dto.level,
    medal: medalValue,
    rank: rankValue,
    score: dto.score,
    popnClass: popnClass.from(dto.popnClass),
  };
}
