// @vitest-environment jsdom
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { getClientI18n } from '~/shared/i18n/client';
import { scoreField } from '../score';
import { draft, renderField } from './render-field';
import '@testing-library/jest-dom/vitest';

describe('scoreField', () => {
  it('round-trips a range through its binding', () => {
    const written = scoreField.binding.write({ min: 90_000, max: 100_000 });

    expect(written).toEqual({ scoreMin: 90_000, scoreMax: 100_000 });
    expect(scoreField.binding.read(written as never)).toEqual({
      min: 90_000,
      max: 100_000,
    });
  });

  it('applies an empty range as absent', () => {
    expect(scoreField.toApplied({})).toBeUndefined();
  });

  it('drafts an absent range as the default', () => {
    expect(scoreField.toDraft(undefined)).toEqual(scoreField.defaultValue);
  });

  it.each([
    ['a fractional bound', { min: 0.5 }, 'tableForm.error.score.range'],
    ['a bound below the minimum', { min: -1 }, 'tableForm.error.score.range'],
    ['a bound above the maximum', { max: 100_001 }, 'tableForm.error.score.range'],
    [
      'a reversed range',
      { min: 100_000, max: 0 },
      'tableForm.error.score.reversed',
    ],
  ])('rejects %s with its own translation key', (_name, value, message) => {
    const result = scoreField.schema.safeParse(value);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(message);
  });

  it('accepts a range within its bounds', () => {
    expect(scoreField.schema.safeParse({ min: 0, max: 100_000 }).success).toBe(true);
  });

  it('carries its bounds on the issue that interpolates them', () => {
    const result = scoreField.schema.safeParse({ max: 100_001 });
    const issue = result.error?.issues[0];

    expect(issue?.code).toBe('custom');
    expect(issue?.code === 'custom' && issue.params).toEqual({ min: 0, max: 100_000 });
  });
});

describe('scoreField render', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('bounds each input by the score range', () => {
    renderField(scoreField);

    for (const label of ['최소', '최대']) {
      const input = screen.getByLabelText(label);

      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100000');
    }
  });

  it('drafts each bound on its own', () => {
    renderField(scoreField);

    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '90000' } });
    expect(draft()).toEqual({ min: 90_000 });

    fireEvent.change(screen.getByLabelText('최대'), { target: { value: '100000' } });
    expect(draft()).toEqual({ min: 90_000, max: 100_000 });
  });

  it('drafts a cleared range back to empty', () => {
    renderField(scoreField);

    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '90000' } });
    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '' } });

    expect(draft()).toEqual({});
  });

  it('shows its own reversed message', async () => {
    renderField(scoreField);

    fireEvent.change(screen.getByLabelText('최소'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('최대'), { target: { value: '0' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '최소 스코어는 최대 스코어보다 클 수 없습니다.',
    );
  });

  it('interpolates its bounds into the out-of-range message', async () => {
    renderField(scoreField);

    fireEvent.change(screen.getByLabelText('최대'), { target: { value: '100001' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(/^스코어는 0~/);
  });
});
