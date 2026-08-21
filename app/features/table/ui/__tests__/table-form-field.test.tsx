import type { TableFormFieldDefinition } from '../../engine/form/field-config';
// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { parseAsString } from 'nuqs';
import { useForm } from 'react-hook-form';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { getClientI18n } from '~/shared/i18n/client';
import { defineTableFormField } from '../../engine/form/field-config';
import { bindTableFormField, TableFormField } from '../table-form-field';
import '@testing-library/jest-dom/vitest';

const versionField = defineTableFormField<string | undefined, string>({
  binding: {
    parsers: { version: parseAsString },
    read: values => values.version ?? undefined,
    write: value => ({ version: value ?? null }),
  },
  defaultValue: '',
  schema: z
    .string()
    .refine(value => value !== 'fraction', 'tableForm.error.level.reversed')
    .refine(value => value !== 'too-high', {
      error: 'tableForm.error.level.range',
      params: { min: 1, max: 50 },
    }),
  toDraft: value => value ?? '',
  toApplied: value => value || undefined,
  render: ({ error, field }) => (
    <label>
      버전
      <select
        aria-label="버전"
        name={field.name}
        ref={field.ref}
        value={field.value}
        onBlur={field.onBlur}
        onChange={event => field.onChange(event.target.value)}
      >
        <option value="">모든 버전</option>
        <option value="Lively">Lively</option>
        <option value="fraction">정수가 아닌 값</option>
        <option value="too-high">범위를 넘는 값</option>
      </select>
      {error && <p data-testid="error">{error}</p>}
    </label>
  ),
});

const form: Record<
  'version',
  TableFormFieldDefinition<string | undefined, string>
> = { version: versionField };

function Probe() {
  const { control, watch } = useForm({
    defaultValues: { version: '' },
    mode: 'onChange',
  });

  return (
    <>
      <TableFormField control={control} form={form} name="version" />
      <output data-testid="value">{watch('version')}</output>
    </>
  );
}

describe('tableFormField', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('renders a reusable definition and forwards draft changes', () => {
    render(<Probe />);

    expect(screen.getByLabelText('버전')).toHaveValue('');

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'Lively' },
    });

    expect(screen.getByTestId('value')).toHaveTextContent('Lively');
  });

  it('translates the first schema message and clears it after a valid change', async () => {
    render(<Probe />);

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'fraction' },
    });

    expect(await screen.findByTestId('error')).toHaveTextContent(
      '최소 레벨은 최대 레벨보다 클 수 없습니다.',
    );

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'Lively' },
    });

    await waitFor(() => expect(screen.queryByTestId('error')).not.toBeInTheDocument());
  });

  it('interpolates the values carried on the issue', async () => {
    render(<Probe />);

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'too-high' },
    });

    expect(await screen.findByTestId('error')).toHaveTextContent(
      '레벨은 1~50 사이의 정수로 입력해 주세요.',
    );
  });
});

const BoundField = bindTableFormField(form);

function BoundProbe() {
  const { control, watch } = useForm({
    defaultValues: { version: '' },
    mode: 'onChange',
  });

  return (
    <>
      <BoundField control={control} name="version" />
      <output data-testid="value">{watch('version')}</output>
    </>
  );
}

describe('bindTableFormField', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('renders the bound config without repeating it at each call', () => {
    render(<BoundProbe />);

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'Lively' },
    });

    expect(screen.getByTestId('value')).toHaveTextContent('Lively');
  });

  it('keeps validating through the bound config', async () => {
    render(<BoundProbe />);

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'too-high' },
    });

    expect(await screen.findByTestId('error')).toHaveTextContent(
      '레벨은 1~50 사이의 정수로 입력해 주세요.',
    );
  });
});
