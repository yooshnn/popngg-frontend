// Types

export type Score = number;

// Conversion and formatting

export const MAX: Score = 100_000;

export function isMax(value: Score): boolean {
  return value >= MAX;
}

export function format(value: Score): string {
  return isMax(value) ? 'MAX' : value.toLocaleString('en-US');
}
