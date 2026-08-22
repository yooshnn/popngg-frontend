import type { Difficulty } from '~/entities/difficulty';
import type { PopnVersion } from '~/entities/popn-version';
import type { Page } from '~/shared/api';

export interface ChartSummary {
  difficulty: Difficulty;
  level: number;
}

export interface SongSummary {
  songHash: string;
  title: string;
  genre: string;
  artist: string;
  bannerUrl: string;
  version: PopnVersion;
  isUpper: boolean;
  charts: ChartSummary[];
}

export type Charts = Page<SongSummary>;
