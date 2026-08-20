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
import { afterEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { defineTableFormField } from '../../engine/form/field-config';
import { TableFormField } from '../table-form-field';
import '@testing-library/jest-dom/vitest';

const versionField = defineTableFormField<string | undefined, string>({
  binding: {
    parsers: { version: parseAsString },
    read: values => values.version ?? undefined,
    write: value => ({ version: value ?? null }),
  },
  defaultValue: '',
  draftSchema: z.string().refine(
    value => value === '' || value === 'Lively',
    '지원하지 않는 버전입니다.',
  ),
  appliedSchema: z.literal('Lively'),
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
        <option value="invalid">잘못된 값</option>
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
  afterEach(cleanup);

  it('renders a reusable definition and forwards draft changes', () => {
    render(<Probe />);

    expect(screen.getByLabelText('버전')).toHaveValue('');

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'Lively' },
    });

    expect(screen.getByTestId('value')).toHaveTextContent('Lively');
  });

  it('forwards the first schema error and clears it after a valid change', async () => {
    render(<Probe />);

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'invalid' },
    });

    expect(await screen.findByTestId('error')).toHaveTextContent(
      '지원하지 않는 버전입니다.',
    );

    fireEvent.change(screen.getByLabelText('버전'), {
      target: { value: 'Lively' },
    });

    await waitFor(() => expect(screen.queryByTestId('error')).not.toBeInTheDocument());
  });
});
