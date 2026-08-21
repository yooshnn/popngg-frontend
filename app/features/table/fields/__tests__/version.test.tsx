// @vitest-environment jsdom
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { popnVersion } from '~/entities/popn-version';
import { getClientI18n } from '~/shared/i18n/client';
import ko from '~/shared/i18n/locales/ko/common';
import { NO_VERSION, versionField } from '../version';
import { draft, renderField } from './render-field';
import '@testing-library/jest-dom/vitest';

describe('versionField', () => {
  it('drafts an absent version as the empty option', () => {
    expect(versionField.toDraft(undefined)).toBe(NO_VERSION);
  });

  it('applies the empty option as absent', () => {
    expect(versionField.toApplied(NO_VERSION)).toBeUndefined();
  });

  it('round-trips a version through its binding', () => {
    const written = versionField.binding.write(versionField.toApplied(29));

    expect(written).toEqual({ version: 29 });
    expect(versionField.binding.read(written as never)).toBe(29);
  });

  it('accepts the empty option as a draft', () => {
    expect(versionField.schema.safeParse(NO_VERSION).success).toBe(true);
  });

  it('rejects a version outside the entity', () => {
    expect(versionField.schema.safeParse(30).success).toBe(false);
  });

  it('discards a version its parser does not recognize', () => {
    const parse = versionField.binding.parsers.version.parse as (
      value: string,
    ) => number | null;

    expect(parse('30')).toBeNull();
    expect(versionField.binding.read({ version: null } as never)).toBeUndefined();
  });

  it('resolves every option to a locale entry', () => {
    for (const version of popnVersion.all) {
      expect(ko.version[version]).toBeTypeOf('string');
    }
  });
});

describe('versionField render', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('offers every version plus an empty option', () => {
    renderField(versionField);

    expect(screen.getAllByRole('option')).toHaveLength(popnVersion.all.length + 1);
    expect(screen.getByRole('option', { name: '모든 버전' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: ko.version[29] })).toBeInTheDocument();
  });

  it('drafts the selected version', () => {
    renderField(versionField);

    fireEvent.change(screen.getByLabelText('버전'), { target: { value: '29' } });

    expect(draft()).toBe(29);
  });

  it('drafts the empty option back to no version', () => {
    renderField(versionField);
    const select = screen.getByLabelText('버전');

    fireEvent.change(select, { target: { value: '29' } });
    fireEvent.change(select, { target: { value: '' } });

    expect(draft()).toBe(NO_VERSION);
  });
});
