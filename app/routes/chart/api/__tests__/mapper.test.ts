import type { ChartDetailDto } from '../dto';
import { describe, expect, it } from 'vitest';
import { toChartDetail } from '../mapper';

function chartDetailDto(overrides: Partial<ChartDetailDto> = {}): ChartDetailDto {
  return {
    songHash: 'popn29-new-57',
    title: 'Daisuke',
    genre: 'ユーロビート',
    artist: 'Tanaka Aki',
    bannerUrl: 'http://localhost:3001/assets/banners/popn29-new-57.png',
    version: 29,
    isUpper: false,
    charts: [
      { difficulty: 1, level: 43 },
      { difficulty: 2, level: 44 },
      { difficulty: 3, level: 45 },
      { difficulty: 4, level: 46 },
    ],
    ...overrides,
  };
}

describe('toChartDetail', () => {
  it('maps a detail to its domain shape, preserving chart order', () => {
    const chart = toChartDetail(chartDetailDto());

    expect(chart).toEqual({
      songHash: 'popn29-new-57',
      title: 'Daisuke',
      genre: 'ユーロビート',
      artist: 'Tanaka Aki',
      bannerUrl: 'http://localhost:3001/assets/banners/popn29-new-57.png',
      version: 29,
      isUpper: false,
      charts: [
        { difficulty: 'light', level: 43 },
        { difficulty: 'normal', level: 44 },
        { difficulty: 'hyper', level: 45 },
        { difficulty: 'ex', level: 46 },
      ],
    });
  });

  it('throws when a chart carries an unknown difficulty code', () => {
    const dto = chartDetailDto({
      charts: [{ difficulty: 9, level: 10 }],
    });

    expect(() => toChartDetail(dto)).toThrow(/difficulty/);
  });

  it('throws when the song carries an unknown version code', () => {
    const dto = chartDetailDto({ version: 0 });

    expect(() => toChartDetail(dto)).toThrow(/version/);
  });
});
