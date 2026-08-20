import type { UrlBinding } from '../core/url-binding';
import type { TableConfig } from '../use-table';
import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { buildTableParams } from '../build-table-params';
import { compileTableConfig } from '../compile-table-config';
import { singleKeyBinding } from '../core/url-binding';

const levelRange: UrlBinding<{ min?: number; max?: number }> = {
  parsers: {
    levelMin: parseAsInteger,
    levelMax: parseAsInteger,
  },
  read: (values) => {
    const min = values.levelMin ?? undefined;
    const max = values.levelMax ?? undefined;
    return min === undefined && max === undefined ? undefined : { min, max };
  },
  write: value => ({
    levelMin: value?.min ?? null,
    levelMax: value?.max ?? null,
  }),
};

const tableConfig = {
  filter: {
    query: singleKeyBinding('q', parseAsString),
    levelRange,
  },
  form: {
    difficulty: {
      binding: singleKeyBinding(
        'difficulty',
        parseAsStringLiteral(['normal', 'hard'] as const),
      ),
      defaultValue: 'normal',
      draftSchema: z.string(),
      appliedSchema: z.enum(['normal', 'hard']),
      toDraft: value => value ?? 'normal',
      toApplied: value => value,
    },
  },
  sort: {
    initial: { key: 'score' as const, order: 'desc' as const },
    options: ['score', 'name'] as const,
  },
  pagination: {
    initial: { size: 20 },
    allowedSizes: [10, 20, 50] as const,
  },
} satisfies TableConfig;

describe('compileTableConfig', () => {
  it('flattens single- and multi-key bindings into one parser map', () => {
    const compiled = compileTableConfig(tableConfig);

    expect(compiled.ownedKeys).toEqual([
      'q',
      'levelMin',
      'levelMax',
      'difficulty',
      'sort',
      'order',
      'page',
      'size',
    ]);
    expect(Object.keys(compiled.parsers)).toEqual(compiled.ownedKeys);
    expect(compiled.parsers).not.toBe(tableConfig);
  });

  it('rejects a physical key owned by two logical fields', () => {
    expect(() =>
      compileTableConfig({
        filter: {
          first: singleKeyBinding('duplicate', parseAsString),
          second: singleKeyBinding('duplicate', parseAsString),
        },
      }),
    ).toThrow(
      'Table query key "duplicate" is owned by both filter.first and filter.second.',
    );
  });

  it('rejects an initial sort key that is not an option', () => {
    expect(() =>
      compileTableConfig({
        sort: {
          initial: { key: 'missing', order: 'asc' },
          options: ['score', 'name'],
        },
      }),
    ).toThrow(
      'Initial table sort key "missing" must be included in sort.options.',
    );
  });

  it('rejects an initial page size that is not allowed', () => {
    expect(() =>
      compileTableConfig({
        pagination: {
          initial: { size: 30 },
          allowedSizes: [10, 20, 50],
        },
      }),
    ).toThrow(
      'Initial table page size "30" must be included in pagination.allowedSizes.',
    );
  });

  it.each([
    ['empty', [], 'Table pagination.allowedSizes cannot be empty.'],
    ['zero', [0], 'Table page size "0" must be a positive safe integer.'],
    ['negative', [-10], 'Table page size "-10" must be a positive safe integer.'],
    ['fraction', [10.5], 'Table page size "10.5" must be a positive safe integer.'],
    ['non-finite', [Infinity], 'Table page size "Infinity" must be a positive safe integer.'],
    ['duplicate', [10, 10], 'Table page size "10" cannot be duplicated.'],
  ] as const)('rejects %s page sizes', (_name, allowedSizes, message) => {
    expect(() =>
      compileTableConfig({
        pagination: {
          initial: { size: 10 },
          allowedSizes,
        },
      }),
    ).toThrow(message);
  });
});

describe('buildTableParams', () => {
  it('serializes only table-owned values and keeps multi-key values together', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {
      q: 'mario',
      levelMin: 5,
      levelMax: 20,
      difficulty: 'hard',
      sort: 'name',
      order: 'asc',
      page: 3,
      size: 50,
      unrelated: 'keep-out',
    });

    expect(params.toString()).toBe(
      'q=mario&levelMin=5&levelMax=20&difficulty=hard&sort=name&order=asc&page=3&size=50',
    );
    expect(params.has('unrelated')).toBe(false);
  });

  it('omits a single-key form value rejected by its applied schema', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { difficulty: 'unknown' });

    expect(params.has('difficulty')).toBe(false);
  });

  it('materializes canonical sort and pagination defaults', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, {});

    expect(params.get('sort')).toBe('score');
    expect(params.get('order')).toBe('desc');
    expect(params.get('page')).toBe('1');
    expect(params.get('size')).toBe('20');
    expect(params.has('q')).toBe(false);
    expect(params.has('levelMin')).toBe(false);
  });

  it('normalizes invalid pagination values when serializing canonical params', () => {
    const compiled = compileTableConfig(tableConfig);
    const params = buildTableParams(compiled, { page: 0, size: 20 });

    expect(params.get('page')).toBe('1');
  });
});
