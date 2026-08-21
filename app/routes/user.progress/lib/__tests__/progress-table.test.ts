import type { ProgressRow } from '../../model/types';
import type { Medal } from '~/entities/medal';
import type { Rank } from '~/entities/rank';
import { describe, expect, it } from 'vitest';
import { clearType, medal } from '~/entities/medal';
import { rank, rankFamily } from '~/entities/rank';
import { progressTable, rowLabel, sortedRows } from '../progress-table';

function toRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function row(key: number): ProgressRow {
  return {
    key,
    total: 0,
    averageScore: 0,
    medalCounts: Object.fromEntries(medal.all.map(value => [value, 0])) as Record<Medal, number>,
    rankCounts: Object.fromEntries(rank.all.map(value => [value, 0])) as Record<Rank, number>,
  };
}

describe('progressTable', () => {
  it('collapses every group into one column in brief detail, with no header groups', () => {
    const medalTable = progressTable('medal', 'brief');
    expect(medalTable.columns).toHaveLength(clearType.all.length + 1);
    expect(medalTable.groups).toEqual([]);

    const rankTable = progressTable('rank', 'brief');
    expect(rankTable.columns).toHaveLength(1 + rankFamily.all.length + 1);
    expect(rankTable.groups).toEqual([]);
  });

  it('expands every group into per-member columns in full detail, spanning the group size', () => {
    const medalTable = progressTable('medal', 'full');
    expect(medalTable.columns).toHaveLength(medal.all.length + 1);
    expect(medalTable.groups.map(group => group.span)).toEqual(
      clearType.all.map(type => clearType.members(type).length),
    );

    const rankTable = progressTable('rank', 'full');
    expect(rankTable.columns).toHaveLength(1 + rank.all.length + 1);
    expect(rankTable.groups.map(group => group.span)).toEqual(
      rankFamily.all.map(family => rankFamily.members(family).length),
    );
  });

  it('leads only the rank table with an average score column', () => {
    expect(progressTable('medal', 'brief').columns[0]?.id).not.toBe('averageScore');
    expect(progressTable('rank', 'brief').columns[0]?.id).toBe('averageScore');
  });

  it('resolves a full-detail member column to its own count', () => {
    const table = progressTable('medal', 'full');
    const column = table.columns.find(item => item.id === 'medal:gold-star');
    const counts = row(1);
    counts.medalCounts['gold-star'] = 42;

    expect(column?.value(counts)).toBe(42);
  });

  it('sums a group\'s members into its collapsed brief-detail column', () => {
    const table = progressTable('medal', 'brief');
    const column = table.columns.find(item => item.id === 'clearType:full-combo');
    const counts = row(1);
    const members = clearType.members('full-combo');

    for (const member of members) counts.medalCounts[member] = 1;

    expect(column?.value(counts)).toBe(members.length);
  });

  it('gives every collapsed brief-detail group column its group color', () => {
    const domainColumn = (table: ReturnType<typeof progressTable>, id: string) => table.columns.find(item => item.id === id);

    expect(domainColumn(progressTable('medal', 'brief'), 'clearType:full-combo')?.color)
      .toBe(clearType.color('full-combo'));
    expect(domainColumn(progressTable('rank', 'brief'), 'rankFamily:AA')?.color)
      .toBe(rankFamily.color('AA'));
  });

  it('gives a full-detail group\'s first member the group color and the rest a translucent version of it', () => {
    const domainColumn = (table: ReturnType<typeof progressTable>, id: string) => table.columns.find(item => item.id === id);
    const table = progressTable('medal', 'full');
    const [first, ...rest] = clearType.members('full-combo');
    const groupColor = clearType.color('full-combo');

    expect(rest.length).toBeGreaterThan(0);
    expect(domainColumn(table, `medal:${first}`)?.color).toBe(groupColor);

    for (const member of rest) {
      expect(domainColumn(table, `medal:${member}`)?.color).toBe(toRgba(groupColor, 0.45));
    }
  });

  it('leaves non-domain columns without a color', () => {
    expect(progressTable('medal', 'full').columns.find(item => item.id === 'total')?.color).toBeUndefined();
    expect(progressTable('rank', 'full').columns.find(item => item.id === 'averageScore')?.color).toBeUndefined();
  });
});

describe('sortedRows', () => {
  it('sorts rows by key descending without mutating the input', () => {
    const rows = [row(1), row(5), row(3)];
    const sorted = sortedRows(rows);

    expect(sorted.map(item => item.key)).toEqual([5, 3, 1]);
    expect(rows.map(item => item.key)).toEqual([1, 5, 3]);
  });
});

describe('rowLabel', () => {
  it('renders a level axis key as-is', () => {
    expect(rowLabel('level', 12)).toBe('12');
  });

  it('renders a difficulty axis key as its difficulty label', () => {
    expect(rowLabel('difficulty', 1)).toBe('LIGHT');
    expect(rowLabel('difficulty', 4)).toBe('EX');
  });
});
