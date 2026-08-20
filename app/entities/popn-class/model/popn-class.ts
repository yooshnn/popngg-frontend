// Types

export type PopnClass = number;

// Conversion and formatting

const SCALE = 100;

export function from(raw: number): PopnClass {
  return raw / SCALE;
}

export function format(value: PopnClass): string {
  return value.toFixed(2);
}
