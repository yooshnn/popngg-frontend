// Definition table

interface MedalDefinition {
  code: number;
  color: string;
  symbol: string;
}

const definitions = {
  'gold-star': { code: 1, color: '#ffbf00', symbol: '★' },
  'silver-star': { code: 2, color: '#3edfcf', symbol: '★' },
  'silver-diamond': { code: 3, color: '#32cbcc', symbol: '◆' },
  'silver-circle': { code: 4, color: '#33bcbc', symbol: '●' },
  'bronze-star': { code: 5, color: '#ff4d80', symbol: '★' },
  'bronze-diamond': { code: 6, color: '#db3765', symbol: '◆' },
  'bronze-circle': { code: 7, color: '#c42753', symbol: '●' },
  'black-star': { code: 8, color: '#8aa8d6', symbol: '★' },
  'black-diamond': { code: 9, color: '#7392c6', symbol: '◆' },
  'black-circle': { code: 10, color: '#5d7fb3', symbol: '●' },
  'easy': { code: 11, color: '#84e0ac', symbol: '☘' },
  'long-off': { code: 12, color: '#b86b32', symbol: '❀' },
  'none': { code: 13, color: '#4c505a', symbol: '—' },
} as const satisfies Record<string, MedalDefinition>;

export type Medal = keyof typeof definitions;

export const all = Object.keys(definitions) as readonly Medal[];

// Lookup

const byCode: Readonly<Record<number, Medal>> = Object.fromEntries(
  all.map(medal => [definitions[medal].code, medal]),
);

// Accessors

export function from(code: number): Medal | null {
  return byCode[code] ?? null;
}

export function code(value: Medal): number {
  return definitions[value].code;
}

export function color(medal: Medal): string {
  return definitions[medal].color;
}

export function symbol(medal: Medal): string {
  return definitions[medal].symbol;
}

export function labelKey(medal: Medal): `medal.name.${Medal}` {
  return `medal.name.${medal}`;
}
