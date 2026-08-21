import { describe, expect, it } from 'vitest';
import { difficulty } from '~/entities/difficulty';
import {
  getRangeValidationIssue,
  rangeBinding,
  selectionBinding,
  writeBinding,
} from '../core/url-binding';

describe('getRangeValidationIssue', () => {
  const bounds = { min: 1, max: 50 };

  it.each([
    ['an absent range', undefined, undefined],
    ['a single valid bound', { max: 50 }, undefined],
    ['a fractional bound', { min: 1.5 }, 'integer'],
    ['a bound below the minimum', { min: 0 }, 'outOfBounds'],
    ['a bound above the maximum', { max: 51 }, 'outOfBounds'],
    ['a reversed range', { min: 20, max: 10 }, 'reversed'],
  ] as const)('reports %s', (_name, value, expected) => {
    expect(getRangeValidationIssue(value, bounds)).toBe(expected);
  });
});

describe('rangeBinding', () => {
  const binding = rangeBinding('levelMin', 'levelMax', { min: 1, max: 50 });

  it('owns both physical keys', () => {
    expect(Object.keys(binding.parsers)).toEqual(['levelMin', 'levelMax']);
  });

  it.each([
    ['a bound below the minimum', { levelMin: 0, levelMax: null }],
    ['a bound above the maximum', { levelMin: null, levelMax: 51 }],
    ['a reversed range', { levelMin: 20, levelMax: 10 }],
  ])('discards %s so the form falls back to its default', (_name, values) => {
    expect(binding.read(values as never)).toBeUndefined();
  });

  it.each([
    ['both bounds', { levelMin: 5, levelMax: 20 }, { min: 5, max: 20 }],
    ['only a lower bound', { levelMin: 5, levelMax: null }, { min: 5, max: undefined }],
    ['only an upper bound', { levelMin: null, levelMax: 20 }, { min: undefined, max: 20 }],
  ])('reads %s', (_name, values, expected) => {
    expect(binding.read(values as never)).toEqual(expected);
  });

  it('reads an absent range as undefined', () => {
    expect(binding.read({ levelMin: null, levelMax: null } as never)).toBeUndefined();
  });

  it('clears the unused bound when writing a partial range', () => {
    expect(binding.write({ min: 5 })).toEqual({ levelMin: 5, levelMax: null });
  });

  it('clears both bounds when writing an absent range', () => {
    expect(binding.write(undefined)).toEqual({ levelMin: null, levelMax: null });
  });

  it('round-trips a range through the query string', () => {
    const params = new URLSearchParams();
    writeBinding(params, binding, { min: 5, max: 20 });

    expect(params.toString()).toBe('levelMin=5&levelMax=20');
  });
});

describe('selectionBinding', () => {
  const binding = selectionBinding('difficulty', difficulty);

  it('owns one physical key', () => {
    expect(Object.keys(binding.parsers)).toEqual(['difficulty']);
  });

  it('reads codes in entity order regardless of query order', () => {
    expect(binding.read({ difficulty: '4,1' } as never)).toEqual(['light', 'ex']);
  });

  it('drops unrecognized codes instead of rejecting the selection', () => {
    expect(binding.read({ difficulty: '1,99' } as never)).toEqual(['light']);
  });

  it.each([
    ['an absent key', null],
    ['an empty value', ''],
    ['a fully selected set', '1,2,3,4'],
    ['only unrecognized codes', '99'],
  ])('reads %s as undefined', (_name, raw) => {
    expect(binding.read({ difficulty: raw } as never)).toBeUndefined();
  });

  it('writes a partial selection as comma-joined codes in entity order', () => {
    expect(binding.write(['ex', 'light'])).toEqual({ difficulty: '1,4' });
  });

  it('deduplicates a repeated member', () => {
    expect(binding.write(['light', 'light'])).toEqual({ difficulty: '1' });
  });

  it.each([
    ['a fully selected set', difficulty.all],
    ['an empty selection', []],
    ['an absent selection', undefined],
  ])('clears the key for %s', (_name, value) => {
    expect(binding.write(value)).toEqual({ difficulty: null });
  });

  it('round-trips a partial selection', () => {
    const selection = ['normal', 'ex'] as const;
    const written = binding.write(selection);

    expect(binding.read(written as never)).toEqual(selection);
  });

  it('round-trips a partial selection through the query string', () => {
    const params = new URLSearchParams();
    writeBinding(params, binding, ['normal', 'ex']);

    expect(params.toString()).toBe('difficulty=2%2C4');
  });
});
