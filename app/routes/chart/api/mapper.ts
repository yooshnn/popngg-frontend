import type { ChartDetail, ChartSummary } from '../model/types';
import type { ChartDetailDto, ChartSummaryDto } from './dto';
import { difficulty } from '~/entities/difficulty';
import { popnVersion } from '~/entities/popn-version';

function toChartSummary(dto: ChartSummaryDto): ChartSummary {
  const value = difficulty.from(dto.difficulty);

  if (!value) {
    throw new Error(`Unknown difficulty code: ${dto.difficulty}`);
  }

  return { difficulty: value, level: dto.level };
}

export function toChartDetail(dto: ChartDetailDto): ChartDetail {
  const version = popnVersion.from(dto.version);

  if (!version) {
    throw new Error(`Unknown version code: ${dto.version}`);
  }

  return {
    songHash: dto.songHash,
    title: dto.title,
    genre: dto.genre,
    artist: dto.artist,
    bannerUrl: dto.bannerUrl,
    version,
    isUpper: dto.isUpper,
    charts: dto.charts.map(toChartSummary),
  };
}
