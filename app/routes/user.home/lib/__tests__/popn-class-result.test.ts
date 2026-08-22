import type { PopnClassTarget } from '../../model/types';
import { describe, expect, it } from 'vitest';
import { averagePopnClass, toClassEquivalent, totalPopnClass } from '../popn-class-result';

function songs(...values: number[]): PopnClassTarget[] {
  return values.map(popnClass => ({ popnClass } as PopnClassTarget));
}

describe('totalPopnClass', () => {
  it('sums every target', () => {
    expect(totalPopnClass(songs(29.34, 29.01, 28.49))).toBeCloseTo(86.84);
  });

  it('is zero without targets', () => {
    expect(totalPopnClass([])).toBe(0);
  });
});

describe('averagePopnClass', () => {
  it('divides the total by the target count', () => {
    expect(averagePopnClass(songs(98, 99, 100))).toBeCloseTo(99);
  });

  it('is zero without targets, rather than NaN', () => {
    expect(averagePopnClass([])).toBe(0);
  });
});

describe('toClassEquivalent', () => {
  it('scales one contribution up to a full set of 60 slots', () => {
    expect(toClassEquivalent(2.934)).toBeCloseTo(176.04);
  });

  it('turns an even split back into the class it sums to', () => {
    const target = songs(...Array.from<number>({ length: 60 }).fill(2.5));

    expect(toClassEquivalent(averagePopnClass(target))).toBeCloseTo(totalPopnClass(target));
  });
});
