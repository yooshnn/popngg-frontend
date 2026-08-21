// @vitest-environment jsdom
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getClientI18n } from '~/shared/i18n/client';
import { levelField } from '../level';
import { draft, renderField } from './render-field';
import '@testing-library/jest-dom/vitest';

describe('levelField', () => {
  it('round-trips a range through its binding', () => {
    const written = levelField.binding.write({ min: 10, max: 20 });

    expect(written).toEqual({ levelMin: 10, levelMax: 20 });
    expect(levelField.binding.read(written as never)).toEqual({ min: 10, max: 20 });
  });

  it('applies an empty range as absent', () => {
    expect(levelField.toApplied({})).toBeUndefined();
  });

  it('drafts an absent range as the default', () => {
    expect(levelField.toDraft(undefined)).toEqual(levelField.defaultValue);
  });

  it.each([
    ['a fractional bound', { min: 1.5 }, 'tableForm.error.level.range'],
    ['a bound below the minimum', { min: 0 }, 'tableForm.error.level.range'],
    ['a bound above the maximum', { max: 51 }, 'tableForm.error.level.range'],
    ['a reversed range', { min: 20, max: 10 }, 'tableForm.error.level.reversed'],
  ])('rejects %s with its own translation key', (_name, value, message) => {
    const result = levelField.schema.safeParse(value);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('accepts a range within its bounds', () => {
    expect(levelField.schema.safeParse({ min: 1, max: 50 }).success).toBe(true);
  });

  it('carries its bounds on the issue that interpolates them', () => {
    const result = levelField.schema.safeParse({ min: 0 });
    const issue = result.error?.issues[0];

    expect(issue?.code).toBe('custom');
    expect(issue?.code === 'custom' && issue.params).toEqual({ min: 1, max: 50 });
  });
});

describe('levelField render', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('offers every level from the maximum down', () => {
    renderField(levelField);
    const [first] = screen.getAllByRole('option', { name: '50' });

    expect(screen.getAllByRole('option')).toHaveLength((50 + 1) * 2);
    expect(first).toBeInTheDocument();
  });

  it('drafts each bound on its own', () => {
    renderField(levelField);

    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '10' } });
    expect(draft()).toEqual({ min: 10 });

    fireEvent.change(screen.getByLabelText('최대'), { target: { value: '20' } });
    expect(draft()).toEqual({ min: 10, max: 20 });
  });

  it('drafts a cleared range back to empty', () => {
    renderField(levelField);

    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '' } });

    expect(draft()).toEqual({});
  });

  it('shows its own reversed message', async () => {
    renderField(levelField);

    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('최대'), { target: { value: '10' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '최소 레벨은 최대 레벨보다 클 수 없습니다.',
    );
  });
});
