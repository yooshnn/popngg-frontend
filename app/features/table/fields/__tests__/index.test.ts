import { describe, expect, it } from 'vitest';
import { tableFields } from '..';

describe('tableFields', () => {
  it('exposes every filter field', () => {
    expect(Object.keys(tableFields)).toEqual([
      'version',
      'level',
      'difficulty',
      'medal',
      'rank',
      'score',
    ]);
  });
});
