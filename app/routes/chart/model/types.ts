import type { Difficulty } from '~/entities/difficulty';
import type { PopnVersion } from '~/entities/popn-version';

export interface ChartSummary {
  difficulty: Difficulty;
  level: number;
}

export interface ChartDetail {
  songHash: string;
  title: string;
  genre: string;
  artist: string;
  bannerUrl: string;
  version: PopnVersion;
  isUpper: boolean;
  charts: ChartSummary[];
}
