import { describe, expect, it } from 'vitest';
import { buildTableParams, compileTableConfig } from '~/features/table';
import { tableConfig } from '../table';

describe('users tableConfig', () => {
  it('resolves to canonical sort and pagination defaults with no filters applied', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {});

    expect(params.toString()).toBe('sort=rank&order=asc&page=1&size=20');
  });

  it('carries a search term and an explicit sort/page selection', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {
      q: 'みみ',
      sort: 'updatedAt',
      order: 'desc',
      page: 2,
      size: 50,
    });

    expect(params.toString()).toBe(
      `q=${encodeURIComponent('みみ')}&sort=updatedAt&order=desc&page=2&size=50`,
    );
  });

  it('falls back to the initial sort key when the URL carries an unknown option', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { sort: 'bogus' });

    expect(params.get('sort')).toBe('rank');
  });

  it('falls back to the initial size when the URL carries a disallowed size', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { size: 7 });

    expect(params.get('size')).toBe('20');
  });
});
