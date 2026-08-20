import type {
  FormDraftValues,
  FormReturn,
} from '../../engine/form/use-table-form';
// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { getClientI18n } from '~/shared/i18n/client';
import { TableFilter } from '../table-filter';
import '@testing-library/jest-dom/vitest';

type EmptyForm = Record<never, never>;

function createForm() {
  const { result } = renderHook(() => useForm<FormDraftValues<EmptyForm>>({
    defaultValues: {},
  }));

  const form: FormReturn<EmptyForm> = {
    values: {},
    apply: vi.fn().mockResolvedValue(new URLSearchParams()),
    resetDraft: vi.fn(),
    discardDraft: vi.fn(),
    clear: vi.fn().mockResolvedValue(new URLSearchParams()),
    control: result.current.control,
    handleSubmit: result.current.handleSubmit,
    isActive: false,
    isValid: true,
  };

  return form;
}

function renderFilter(form = createForm()) {
  render(
    <TableFilter form={form}>
      <div>필터 내용</div>
    </TableFilter>,
  );

  return form;
}

describe('tableFilter', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('seeds the draft from applied values when the dialog opens', () => {
    const form = renderFilter();

    fireEvent.click(screen.getAllByRole('button', { name: '필터' })[0]);

    expect(form.discardDraft).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: '필터' })).toBeInTheDocument();
  });

  it('applies the draft and closes the dialog', async () => {
    const form = renderFilter();

    fireEvent.click(screen.getAllByRole('button', { name: '필터' })[0]);
    fireEvent.click(screen.getByRole('button', { name: '적용' }));

    await waitFor(() => {
      expect(form.apply).toHaveBeenCalledWith({});
      expect(screen.queryByRole('dialog', { name: '필터' })).not.toBeInTheDocument();
    });
  });

  it('disables apply while the form is invalid', () => {
    const form = createForm();
    form.isValid = false;
    renderFilter(form);

    fireEvent.click(screen.getAllByRole('button', { name: '필터' })[0]);

    expect(screen.getByRole('button', { name: '적용' })).toBeDisabled();
  });
});
