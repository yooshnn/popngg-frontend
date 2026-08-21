import { describe, expect, it } from 'vitest';
import { difficulty } from '~/entities/difficulty';
import { buildTableParams, compileTableConfig } from '~/features/table';
import { tableConfig } from '../table';

describe('charts tableConfig', () => {
  it('resolves to canonical sort and pagination defaults with no filters applied', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {});

    expect(params.toString()).toBe('sort=version&order=desc&page=1&size=20');
  });

  it('does not carry unfiltered form defaults', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {});

    expect(params.has('version')).toBe(false);
    expect(params.has('levelMin')).toBe(false);
    expect(params.has('levelMax')).toBe(false);
    expect(params.has('difficulty')).toBe(false);
  });

  it('joins a partial difficulty selection as comma-separated codes', () => {
    const compiled = compileTableConfig(tableConfig);
    const selected = ['light', 'ex'] as const;
    const params = buildTableParams(compiled, {
      difficulty: selected.map(difficulty.code).join(','),
    });

    expect(params.get('difficulty')).toBe(selected.map(difficulty.code).join(','));
  });

  it('falls back to the initial sort key when the URL carries an unknown option', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { sort: 'bogus' });

    expect(params.get('sort')).toBe('version');
  });

  it('falls back to the initial size when the URL carries a disallowed size', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { size: 7 });

    expect(params.get('size')).toBe('20');
  });
});
