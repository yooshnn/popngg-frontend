import type { ProgressAxis, ProgressCounts, ProgressRow } from '../model/types';
import type { ProgressDetail } from './progress-search-params';
import type { ClearType, Medal } from '~/entities/medal';
import type { Rank } from '~/entities/rank';
import { difficulty } from '~/entities/difficulty';
import { clearType } from '~/entities/medal';
import { rankFamily } from '~/entities/rank';

// Types

export type ProgressTableKind = 'medal' | 'rank';

export type ProgressColumnLabel = 'averageScore' | 'total';

export type ProgressColumnHeader
  = | { type: 'medal'; medal: Medal }
    | { type: 'rank'; rank: Rank }
    | { type: 'clearType'; clearType: ClearType }
    | { type: 'literal'; text: string }
    | { type: 'label'; labelKey: ProgressColumnLabel };

export interface ProgressColumn {
  id: string;
  header: ProgressColumnHeader;
  color?: string;
  emphasis?: boolean;
  format?: 'score';
  groupId?: string;
  value: (counts: ProgressCounts) => number;
}

export interface ProgressColumnGroup {
  id: string;
  header: ProgressColumnHeader;
  span: number;
}

export interface ProgressTableModel {
  columns: ProgressColumn[];
  groups: ProgressColumnGroup[];
}

interface GroupingMember {
  id: string;
  header: ProgressColumnHeader;
  value: (counts: ProgressCounts) => number;
}

interface Grouping {
  color: string;
  header: ProgressColumnHeader;
  id: string;
  members: GroupingMember[];
}

// Groupings

function medalGroupings(): Grouping[] {
  return clearType.all.map(type => ({
    color: clearType.color(type),
    header: { type: 'clearType', clearType: type },
    id: `clearType:${type}`,
    members: clearType.members(type).map(value => ({
      header: { type: 'medal', medal: value },
      id: `medal:${value}`,
      value: (counts: ProgressCounts) => counts.medalCounts[value],
    })),
  }));
}

function rankGroupings(): Grouping[] {
  return rankFamily.all.map(family => ({
    color: rankFamily.color(family),
    header: { type: 'literal', text: rankFamily.scoreLabel(family) },
    id: `rankFamily:${family}`,
    members: rankFamily.members(family).map(value => ({
      header: { type: 'rank', rank: value },
      id: `rank:${value}`,
      value: (counts: ProgressCounts) => counts.rankCounts[value],
    })),
  }));
}

// Kinds

const averageScoreColumn: ProgressColumn = {
  format: 'score',
  header: { type: 'label', labelKey: 'averageScore' },
  id: 'averageScore',
  value: counts => counts.averageScore,
};

const totalColumn: ProgressColumn = {
  emphasis: true,
  header: { type: 'label', labelKey: 'total' },
  id: 'total',
  value: counts => counts.total,
};

const tableSpecs: Record<ProgressTableKind, { groupings: () => Grouping[]; leading: ProgressColumn[] }> = {
  medal: { groupings: medalGroupings, leading: [] },
  rank: { groupings: rankGroupings, leading: [averageScoreColumn] },
};

// Model

export function progressTable(kind: ProgressTableKind, detail: ProgressDetail): ProgressTableModel {
  const spec = tableSpecs[kind];
  const groupings = spec.groupings();

  return {
    columns: [...spec.leading, ...groupedColumns(groupings, detail), totalColumn],
    groups: detail === 'brief'
      ? []
      : groupings.map(group => ({
          header: group.header,
          id: group.id,
          span: group.members.length,
        })),
  };
}

const memberAlpha = 0.45;

function groupedColumns(groupings: Grouping[], detail: ProgressDetail): ProgressColumn[] {
  return groupings.flatMap((group): ProgressColumn[] => {
    if (detail === 'brief') {
      return [{
        color: group.color,
        header: group.header,
        id: group.id,
        value: counts => sum(group.members, member => member.value(counts)),
      }];
    }

    return group.members.map((member, index) => ({
      color: index === 0 ? group.color : withAlpha(group.color, memberAlpha),
      groupId: group.id,
      header: member.header,
      id: member.id,
      value: member.value,
    }));
  });
}

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function sum<Member>(members: readonly Member[], count: (member: Member) => number): number {
  return members.reduce((total, member) => total + count(member), 0);
}

// Rows

export function sortedRows(rows: readonly ProgressRow[]): ProgressRow[] {
  return [...rows].sort((left, right) => right.key - left.key);
}

export function rowLabel(axis: ProgressAxis, key: number): string {
  if (axis === 'level')
    return String(key);

  const value = difficulty.from(key);

  return value ? difficulty.label(value) : String(key);
}
