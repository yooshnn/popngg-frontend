// Types

export const all = [
  'light',
  'normal',
  'hyper',
  'ex',
] as const;

export type Difficulty = (typeof all)[number];

interface DifficultyDefinition {
  code: number;
  color: string;
  label: string;
  shortLabel: string;
}

// Definition table

const definitions = {
  light: { code: 1, color: '#45bde8', label: 'LIGHT', shortLabel: 'L' },
  normal: { code: 2, color: '#55b978', label: 'NORMAL', shortLabel: 'N' },
  hyper: { code: 3, color: '#d99d20', label: 'HYPER', shortLabel: 'H' },
  ex: { code: 4, color: '#e35b79', label: 'EX', shortLabel: 'EX' },
} as const satisfies Record<Difficulty, DifficultyDefinition>;

// Lookup

const byCode: Readonly<Record<number, Difficulty>> = Object.fromEntries(
  all.map(value => [definitions[value].code, value]),
);

// Accessors

export function from(code: number): Difficulty | null {
  return byCode[code] ?? null;
}

export function code(value: Difficulty): number {
  return definitions[value].code;
}

export function color(value: Difficulty): string {
  return definitions[value].color;
}

export function label(value: Difficulty): string {
  return definitions[value].label;
}

export function shortLabel(value: Difficulty): string {
  return definitions[value].shortLabel;
}
