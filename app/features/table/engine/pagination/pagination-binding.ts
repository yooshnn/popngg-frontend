import type { UrlBinding } from '../core/url-binding';

import type { PaginationConfig } from './use-table-pagination';
import { createParser, parseAsNumberLiteral } from 'nuqs';
import { singleKeyBinding } from '../core/url-binding';

export function normalizePage(value: number | undefined) {
  return value !== undefined && Number.isSafeInteger(value) && value >= 1
    ? value
    : 1;
}

const parseAsTablePage = createParser({
  parse: (value) => {
    if (!/^[1-9]\d*$/.test(value))
      return 0;

    const page = Number(value);
    return Number.isSafeInteger(page) ? page : 0;
  },
  serialize: value => String(normalizePage(value)),
});

/** Pagination bindings bundled with the declared config they were compiled from. */
export interface CompiledPaginationBindings<TSize extends number = number> {
  readonly config: PaginationConfig<TSize>;
  readonly page: UrlBinding<number>;
  readonly size: UrlBinding<TSize>;
}

export function compilePaginationBindings<TSize extends number>(
  paginationConfig: PaginationConfig<TSize>,
): CompiledPaginationBindings<TSize> {
  validatePaginationSizes(paginationConfig.allowedSizes);

  if (!paginationConfig.allowedSizes.includes(paginationConfig.initial.size)) {
    throw new Error(
      `Initial table page size "${paginationConfig.initial.size}" must be included in pagination.allowedSizes.`,
    );
  }

  return {
    config: paginationConfig,
    page: {
      parsers: { page: parseAsTablePage },
      read: values => values.page ?? undefined,
      write: value => ({
        page: value === undefined ? null : normalizePage(value),
      }),
    },
    size: singleKeyBinding(
      'size',
      parseAsNumberLiteral(paginationConfig.allowedSizes),
    ),
  };
}

function validatePaginationSizes(allowedSizes: readonly number[]) {
  if (allowedSizes.length === 0) {
    throw new Error('Table pagination.allowedSizes cannot be empty.');
  }

  const seen = new Set<number>();
  for (const size of allowedSizes) {
    if (!Number.isSafeInteger(size) || size < 1) {
      throw new Error(
        `Table page size "${size}" must be a positive safe integer.`,
      );
    }

    if (seen.has(size)) {
      throw new Error(`Table page size "${size}" cannot be duplicated.`);
    }

    seen.add(size);
  }
}
