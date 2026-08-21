import type { Charts, ChartSummary, SongSummary } from '../model/types';
import type { ChartsDto, ChartSummaryDto, SongSummaryDto } from './dto';
import { difficulty } from '~/entities/difficulty';
import { popnVersion } from '~/entities/popn-version';

function toChartSummary(dto: ChartSummaryDto): ChartSummary {
  const value = difficulty.from(dto.difficulty);

  if (!value) {
    throw new Error(`Unknown difficulty code: ${dto.difficulty}`);
  }

  return { difficulty: value, level: dto.level };
}

function toSongSummary(dto: SongSummaryDto): SongSummary {
  const version = popnVersion.from(dto.version);

  if (!version) {
    throw new Error(`Unknown version code: ${dto.version}`);
  }

  return {
    songHash: dto.songHash,
    title: dto.title,
    genre: dto.genre,
    bannerUrl: dto.bannerUrl,
    version,
    isUpper: dto.isUpper,
    charts: dto.charts.map(toChartSummary),
  };
}

export function toCharts(dto: ChartsDto): Charts {
  return {
    ...dto,
    items: dto.items.map(toSongSummary),
  };
}
