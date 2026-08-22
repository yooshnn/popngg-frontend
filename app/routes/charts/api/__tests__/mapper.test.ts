import type { ChartsDto, SongSummaryDto } from '../dto';
import { describe, expect, it } from 'vitest';
import { toCharts } from '../mapper';

function songSummaryDto(overrides: Partial<SongSummaryDto> = {}): SongSummaryDto {
  return {
    songHash: 'popn29-new-57',
    title: 'Daisuke',
    genre: 'ユーロビート',
    artist: 'wac',
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

function chartsDto(items: SongSummaryDto[]): ChartsDto {
  return {
    items,
    totalItems: items.length,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  };
}

describe('toCharts', () => {
  it('maps a summary to its domain shape, preserving chart order', () => {
    const charts = toCharts(chartsDto([songSummaryDto()]));

    expect(charts.items[0]).toEqual({
      songHash: 'popn29-new-57',
      title: 'Daisuke',
      genre: 'ユーロビート',
      artist: 'wac',
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

  it('carries page metadata through unchanged', () => {
    const dto = chartsDto([songSummaryDto()]);
    const charts = toCharts({ ...dto, totalItems: 60, totalPages: 3, hasNext: true });

    expect(charts.totalItems).toBe(60);
    expect(charts.totalPages).toBe(3);
    expect(charts.hasNext).toBe(true);
  });

  it('throws when a chart carries an unknown difficulty code', () => {
    const dto = chartsDto([songSummaryDto({
      charts: [{ difficulty: 9, level: 10 }],
    })]);

    expect(() => toCharts(dto)).toThrow(/difficulty/);
  });

  it('throws when a song carries an unknown version code', () => {
    const dto = chartsDto([songSummaryDto({ version: 0 })]);

    expect(() => toCharts(dto)).toThrow(/version/);
  });
});
