import { describe, expect, it } from 'vitest';
import { canonicalizeSelection, toggleGroup, toggleSelection } from '../selection';

const all = ['a', 'b', 'c'] as const;

describe('canonicalizeSelection', () => {
  it('reduces a partial selection to entity order', () => {
    expect(canonicalizeSelection(['c', 'a'], all)).toEqual(['a', 'c']);
  });

  it.each([
    ['an empty selection', []],
    ['a full selection', [...all]],
  ])('treats %s as absent', (_name, selected) => {
    expect(canonicalizeSelection(selected, all)).toBeUndefined();
  });
});

describe('toggleSelection', () => {
  it('adds a value in entity order', () => {
    expect(toggleSelection(['c'], 'a', all)).toEqual(['a', 'c']);
  });

  it('removes a selected value', () => {
    expect(toggleSelection(['a', 'c'], 'c', all)).toEqual(['a']);
  });
});

describe('toggleGroup', () => {
  it('selects every member of an incomplete group', () => {
    expect(toggleGroup(['a'], ['a', 'b'], all)).toEqual(['a', 'b']);
  });

  it('clears a group that is already complete', () => {
    expect(toggleGroup(['a', 'b', 'c'], ['a', 'b'], all)).toEqual(['c']);
  });
});
