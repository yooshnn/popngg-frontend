// Types

export const all = [
  'S+',
  'S',
  'AAA',
  'AA+',
  'AA',
  'A+',
  'A',
  'B+',
  'B',
  'C',
  'D',
  'E',
  'none',
] as const;

export type Rank = (typeof all)[number];

interface RankDefinition {
  code: number;
  color: string;
}

// Definition table

const definitions = {
  'S+': { code: 1, color: '#ffbf00' },
  'S': { code: 2, color: '#f5a623' },
  'AAA': { code: 3, color: '#3edfcf' },
  'AA+': { code: 4, color: '#ff6b96' },
  'AA': { code: 5, color: '#db3765' },
  'A+': { code: 6, color: '#a883d8' },
  'A': { code: 7, color: '#8a5cc0' },
  'B+': { code: 8, color: '#6f8fbd' },
  'B': { code: 9, color: '#5a7399' },
  'C': { code: 10, color: '#767b87' },
  'D': { code: 11, color: '#676b76' },
  'E': { code: 12, color: '#585c66' },
  'none': { code: 13, color: '#4c505a' },
} as const satisfies Record<Rank, RankDefinition>;

// Lookup

const byCode: Readonly<Record<number, Rank>> = Object.fromEntries(
  all.map(value => [definitions[value].code, value]),
);

// Accessors

export function from(code: number): Rank | null {
  return byCode[code] ?? null;
}

export function code(value: Rank): number {
  return definitions[value].code;
}

export function color(value: Rank): string {
  return definitions[value].color;
}

export function labelKey(value: Rank): `rank.name.${Rank}` {
  return `rank.name.${value}`;
}
