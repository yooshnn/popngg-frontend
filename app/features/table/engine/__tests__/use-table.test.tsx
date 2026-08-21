import type { UrlBinding } from '../core/url-binding';
import type { TableConfig, TableReturn } from '../use-table';
// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { parseAsInteger, parseAsString } from 'nuqs';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { z } from 'zod';
import { rangeBinding, singleKeyBinding } from '../core/url-binding';
import { useTable } from '../use-table';
import '@testing-library/jest-dom/vitest';

const levelRangeFilter: UrlBinding<{ min?: number; max?: number }> = {
  parsers: {
    levelMin: parseAsInteger,
    levelMax: parseAsInteger,
  },
  read: values => ({
    min: values.levelMin ?? undefined,
    max: values.levelMax ?? undefined,
  }),
  write: value => ({
    levelMin: value?.min ?? null,
    levelMax: value?.max ?? null,
  }),
};

const levelField = {
  binding: rangeBinding('formMin', 'formMax', { min: 1, max: 50 }),
  defaultValue: { min: '', max: '' },
  schema: z
    .object({
      min: z.string(),
      max: z.string(),
    })
    .refine(
      value => value.min === '' || value.max === '' || Number(value.min) <= Number(value.max),
      '최대 레벨은 최소 레벨보다 작을 수 없습니다.',
    ),
  toDraft: (value: { min?: number; max?: number } | undefined) => ({
    min: value?.min === undefined ? '' : String(value.min),
    max: value?.max === undefined ? '' : String(value.max),
  }),
  toApplied: (value: { min: string; max: string }) => ({
    min: value.min ? Number(value.min) : undefined,
    max: value.max ? Number(value.max) : undefined,
  }),
};

const config = {
  filter: {
    query: singleKeyBinding('q', parseAsString),
    level: levelRangeFilter,
  },
  form: {
    level: levelField,
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

type ConfigPaginationReturn = NonNullable<
  TableReturn<typeof config>['pagination']
>;

expectTypeOf<ConfigPaginationReturn['setSize']>()
  .parameter(0)
  .toEqualTypeOf<10 | 20 | 50>();

function Probe() {
  const table = useTable(config);

  return (
    <>
      <output data-testid="state">
        {table.filter?.query.value ?? ''}
        |
        {table.filter?.level.value?.min ?? ''}
        -
        {table.filter?.level.value?.max ?? ''}
        |
        {table.sort?.key}
        |
        {table.pagination?.page}
      </output>
      <output data-testid="params">{table.params.toString()}</output>
      <button
        type="button"
        onClick={() => {
          void table.filter?.query.setValue('new');
          void table.filter?.level.setValue({ min: 4, max: 9 });
        }}
      >
        apply filters
      </button>
      <button type="button" onClick={() => void table.pagination?.setPage(3)}>
        next page
      </button>
      <button type="button" onClick={() => void table.sort?.setKey('score')}>
        sort by score
      </button>
    </>
  );
}

function FormProbe() {
  const table = useTable(config);
  const [applyError, setApplyError] = useState(false);

  return (
    <>
      <Controller
        control={table.form!.control}
        name="level"
        render={({ field }) => (
          <>
            <input
              aria-label="level min"
              value={field.value.min}
              onChange={event =>
                field.onChange({ ...field.value, min: event.target.value })}
            />
            <input
              aria-label="level max"
              value={field.value.max}
              onChange={event =>
                field.onChange({ ...field.value, max: event.target.value })}
            />
          </>
        )}
      />
      <output data-testid="form-active">{String(table.form?.isActive)}</output>
      <output data-testid="form-error">{String(applyError)}</output>
      <output data-testid="form-params">{table.params.toString()}</output>
      <button
        type="button"
        onClick={() => void table.filter?.query.setValue('changed')}
      >
        change unrelated filter
      </button>
      <button
        type="button"
        onClick={() =>
          void table.form?.apply({ level: { min: '8', max: '9' } })}
      >
        apply form
      </button>
      <button type="button" onClick={() => table.form?.resetDraft()}>
        reset form draft
      </button>
      <button
        type="button"
        onClick={() =>
          void table.form
            ?.apply({ level: { min: '9', max: '8' } })
            .then(() => setApplyError(false), () => setApplyError(true))}
      >
        apply invalid form
      </button>
      <button
        type="button"
        onClick={() =>
          void table.form
            ?.apply({ level: { min: '999', max: '' } })
            .then(() => setApplyError(false), () => setApplyError(true))}
      >
        apply trusted transformed value
      </button>
    </>
  );
}

function PaginationProbe() {
  const table = useTable(config);
  const [invalidSizeError, setInvalidSizeError] = useState(false);

  return (
    <>
      <output data-testid="pagination-state">
        {table.pagination?.page}
        |
        {table.pagination?.size}
      </output>
      <button
        type="button"
        onClick={() => void table.pagination?.setSize(10)}
      >
        change page size
      </button>
      <button
        type="button"
        onClick={() => {
          // @ts-expect-error Intentional runtime-boundary test.
          void table.pagination!.setSize(30).catch(() => setInvalidSizeError(true));
        }}
      >
        use invalid page size
      </button>
      <output data-testid="pagination-error">{String(invalidSizeError)}</output>
    </>
  );
}

describe('useTable', () => {
  afterEach(() => cleanup());

  it('uses one Nuqs transaction for multi-key updates and preserves unrelated keys', async () => {
    const onUrlUpdate = vi.fn();

    render(<Probe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams:
          '?view=grid&q=old&levelMin=1&levelMax=2&sort=name&order=asc&page=2&size=50',
      }),
    });

    expect(screen.getByTestId('state')).toHaveTextContent('old|1-2|name|2');
    expect(screen.getByTestId('params')).not.toHaveTextContent('view=grid');

    fireEvent.click(screen.getByRole('button', { name: 'apply filters' }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const update = onUrlUpdate.mock.lastCall?.[0];
    expect(update.searchParams.get('view')).toBe('grid');
    expect(update.searchParams.get('q')).toBe('new');
    expect(update.searchParams.get('levelMin')).toBe('4');
    expect(update.searchParams.get('levelMax')).toBe('9');
    expect(update.searchParams.get('page')).toBe('1');
  });

  it('writes pagination through the same table-owned query map', async () => {
    const onUrlUpdate = vi.fn();

    render(<Probe />, {
      wrapper: withNuqsTestingAdapter({
        onUrlUpdate,
        searchParams: '?view=list&page=1&size=20',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'next page' }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const update = onUrlUpdate.mock.lastCall?.[0];
    expect(update.searchParams.get('view')).toBe('list');
    expect(update.searchParams.get('page')).toBe('3');
    expect(update.searchParams.get('size')).toBe('20');
  });

  it('updates to an allowed page size and resets the page', async () => {
    const onUrlUpdate = vi.fn();

    render(<PaginationProbe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams: '?page=3&size=20',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'change page size' }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const update = onUrlUpdate.mock.lastCall?.[0];
    expect(update.searchParams.get('page')).toBe('1');
    expect(update.searchParams.get('size')).toBe('10');
  });

  it('rejects a page size outside the allowed list without changing the URL', async () => {
    const onUrlUpdate = vi.fn();

    render(<PaginationProbe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams: '?page=3&size=20',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'use invalid page size' }));

    await waitFor(() =>
      expect(screen.getByTestId('pagination-error')).toHaveTextContent('true'),
    );
    expect(onUrlUpdate).not.toHaveBeenCalled();
    expect(screen.getByTestId('pagination-state')).toHaveTextContent('3|20');
  });

  it('replaces invalid page values with the first page', async () => {
    const onUrlUpdate = vi.fn();

    render(<Probe />, {
      wrapper: withNuqsTestingAdapter({
        onUrlUpdate,
        searchParams: '?view=list&page=0&size=20',
      }),
    });

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const update = onUrlUpdate.mock.lastCall?.[0];
    expect(update.searchParams.get('view')).toBe('list');
    expect(update.searchParams.get('page')).toBe('1');
  });

  it('updates sort and resets pagination through the shared query map', async () => {
    const onUrlUpdate = vi.fn();

    render(<Probe />, {
      wrapper: withNuqsTestingAdapter({
        onUrlUpdate,
        searchParams: '?view=list&sort=name&order=asc&page=4&size=20',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'sort by score' }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const update = onUrlUpdate.mock.lastCall?.[0];
    expect(update.searchParams.get('view')).toBe('list');
    expect(update.searchParams.get('sort')).toBe('score');
    expect(update.searchParams.get('order')).toBe('asc');
    expect(update.searchParams.get('page')).toBe('1');
  });

  it('preserves an object-shaped draft across unrelated query updates', async () => {
    const onUrlUpdate = vi.fn();

    render(<FormProbe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams: '?q=old&formMin=1&formMax=2',
      }),
    });

    fireEvent.change(screen.getByLabelText('level min'), {
      target: { value: '7' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'change unrelated filter' }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    expect(screen.getByLabelText('level min')).toHaveValue('7');
    expect(screen.getByLabelText('level max')).toHaveValue('2');
  });

  it('hydrates the form draft from initial URL values', () => {
    render(<FormProbe />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: '?formMin=3&formMax=8',
      }),
    });

    expect(screen.getByLabelText('level min')).toHaveValue('3');
    expect(screen.getByLabelText('level max')).toHaveValue('8');
    expect(screen.getByTestId('form-active')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: 'reset form draft' }));

    expect(screen.getByLabelText('level min')).toHaveValue('');
    expect(screen.getByLabelText('level max')).toHaveValue('');
  });

  it('drops an invalid multi-key applied value from the draft and params', () => {
    render(<FormProbe />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: '?formMin=999&formMax=10',
      }),
    });

    expect(screen.getByLabelText('level min')).toHaveValue('');
    expect(screen.getByLabelText('level max')).toHaveValue('');
    expect(screen.getByTestId('form-active')).toHaveTextContent('false');
    expect(screen.getByTestId('form-params')).not.toHaveTextContent('formMin');
    expect(screen.getByTestId('form-params')).not.toHaveTextContent('formMax');
  });

  it('resets the draft to the applied values after apply', async () => {
    const onUrlUpdate = vi.fn();

    render(<FormProbe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams: '?q=old',
      }),
    });

    expect(screen.getByTestId('form-active')).toHaveTextContent('false');

    fireEvent.change(screen.getByLabelText('level min'), {
      target: { value: '7' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'apply form' }));

    await waitFor(() => {
      expect(onUrlUpdate.mock.lastCall?.[0].searchParams.get('formMin')).toBe(
        '8',
      );
    });
    await waitFor(() => {
      expect(screen.getByLabelText('level min')).toHaveValue('8');
      expect(screen.getByLabelText('level max')).toHaveValue('9');
    });
    expect(screen.getByTestId('form-active')).toHaveTextContent('true');
  });

  it('blocks direct form apply when a field schema is invalid', async () => {
    const onUrlUpdate = vi.fn();

    render(<FormProbe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams: '?q=old',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'apply invalid form' }));

    await waitFor(() =>
      expect(screen.getByTestId('form-error')).toHaveTextContent('true'),
    );
    expect(onUrlUpdate).not.toHaveBeenCalled();
  });

  it('trusts the applied value produced from a valid draft', async () => {
    const onUrlUpdate = vi.fn();

    render(<FormProbe />, {
      wrapper: withNuqsTestingAdapter({
        hasMemory: true,
        onUrlUpdate,
        searchParams: '?q=old',
      }),
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'apply trusted transformed value' }),
    );

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    expect(screen.getByTestId('form-error')).toHaveTextContent('false');
    expect(onUrlUpdate.mock.lastCall?.[0].searchParams.get('formMin')).toBe(
      '999',
    );
  });
});
