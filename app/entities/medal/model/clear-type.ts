import type { Medal } from './medal';
import { all as medals } from './medal';

// Definition table

interface ClearTypeDefinition {
  color: string;
}

const definitions = {
  'perfect': { color: '#ffbf00' },
  'full-combo': { color: '#32cbcc' },
  'clear': { color: '#ff4d80' },
  'assist': { color: '#84e0ac' },
  'failed': { color: '#8aa8d6' },
} as const satisfies Record<string, ClearTypeDefinition>;

export type ClearType = keyof typeof definitions;

export const all = Object.keys(definitions) as readonly ClearType[];

const typeByMedal = {
  'gold-star': 'perfect',
  'silver-star': 'full-combo',
  'silver-diamond': 'full-combo',
  'silver-circle': 'full-combo',
  'bronze-star': 'clear',
  'bronze-diamond': 'clear',
  'bronze-circle': 'clear',
  'easy': 'assist',
  'long-off': 'assist',
  'black-star': 'failed',
  'black-diamond': 'failed',
  'black-circle': 'failed',
  'none': 'failed',
} as const satisfies Record<Medal, ClearType>;

const byType = medals.reduce<Record<ClearType, Medal[]>>(
  (groups, medal) => {
    const type = typeByMedal[medal];
    (groups[type] ??= []).push(medal);
    return groups;
  },
  {} as Record<ClearType, Medal[]>,
);

export function of(medal: Medal): ClearType {
  return typeByMedal[medal];
}

export function members(type: ClearType): readonly Medal[] {
  return byType[type];
}

export function color(type: ClearType): string {
  return definitions[type].color;
}

export function labelKey(type: ClearType): `medal.clearType.${ClearType}` {
  return `medal.clearType.${type}`;
}

// Clear milestones

export const milestones = [
  'clear',
  'full-combo',
  'perfect',
] as const satisfies readonly ClearType[];

export type ClearMilestone = (typeof milestones)[number];
