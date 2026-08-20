// Types

export const all = [
  29,
  28,
  27,
  26,
  25,
  24,
  23,
  22,
  21,
  20,
  19,
  18,
  17,
  16,
  15,
  14,
  13,
  12,
  11,
  10,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
  99,
] as const;

export type PopnVersion = (typeof all)[number];

export const latest: PopnVersion = 29;

// Lookup

const byCode: Readonly<Record<number, PopnVersion>> = Object.fromEntries(
  all.map(value => [value, value]),
);

// Accessors

export function from(code: number): PopnVersion | null {
  if (!Number.isInteger(code))
    return null;

  return byCode[code] ?? null;
}
