import { describe, expect, it } from 'vitest';
import { medal } from '~/entities/medal';
import { buildTableParams, compileTableConfig } from '~/features/table';
import { tableConfig } from '../table';

describe('records tableConfig', () => {
  it('resolves to canonical sort and pagination defaults with no filters applied', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {});

    expect(params.toString()).toBe('sort=level&order=desc&page=1&size=20');
  });

  it('carries a search term and an explicit sort/page selection', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {
      q: 'mario',
      sort: 'score',
      order: 'asc',
      page: 2,
      size: 50,
    });

    expect(params.toString()).toBe(
      'q=mario&sort=score&order=asc&page=2&size=50',
    );
  });

  it('joins a partial medal selection as comma-separated codes', () => {
    const compiled = compileTableConfig(tableConfig);
    const selected = ['gold-star', 'easy'] as const;
    const params = buildTableParams(compiled, {
      medal: selected.map(medal.code).join(','),
    });

    expect(params.get('medal')).toBe(selected.map(medal.code).join(','));
    expect(params.get('sort')).toBe('level');
  });

  it('omits a full medal selection, matching an unfiltered table', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {
      medal: medal.all.map(medal.code).join(','),
    });

    expect(params.has('medal')).toBe(false);
  });

  it('never carries the view parameter, which the table does not own', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { view: 'card' });

    expect(params.has('view')).toBe(false);
  });
});
