// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import koCommon from '~/shared/i18n/locales/ko/common';
import { useRelativeDate } from '../use-relative-date';

beforeAll(async () => {
  await i18next.use(initReactI18next).init({
    lng: 'ko',
    fallbackLng: 'ko',
    defaultNS: 'common',
    resources: { ko: { common: koCommon } },
  });
});

afterEach(() => {
  vi.useRealTimers();
});

function renderRelativeDate() {
  return renderHook(() => useRelativeDate(), {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    ),
  });
}

const JST_NOON = 'T03:00:00.000Z';

describe('useRelativeDate', () => {
  it('returns "today" for the same JST calendar day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`2026-08-21${JST_NOON}`));

    const { result } = renderRelativeDate();
    expect(result.current(new Date(`2026-08-21${JST_NOON}`))).toBe('오늘');
  });

  it('returns "N days ago" inside the relative window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`2026-08-21${JST_NOON}`));

    const { result } = renderRelativeDate();
    expect(result.current(new Date(`2026-08-18${JST_NOON}`))).toBe('3일 전');
  });

  it('falls back to a month/day format at the relative window boundary within the same year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`2026-08-21${JST_NOON}`));

    const { result } = renderRelativeDate();
    expect(result.current(new Date(`2026-08-10${JST_NOON}`))).toBe('8월 10일');
  });

  it('falls back to a Y.MM format once the year differs', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`2026-08-21${JST_NOON}`));

    const { result } = renderRelativeDate();
    expect(result.current(new Date(`2024-11-05${JST_NOON}`))).toBe('2024.11');
  });

  it('resolves the JST day boundary rather than the local calendar day', () => {
    // 2026-08-20 23:30 UTC is already 2026-08-21 08:30 JST.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-20T23:30:00.000Z'));

    const { result } = renderRelativeDate();
    expect(result.current(new Date('2026-08-20T23:30:00.000Z'))).toBe('오늘');
  });
});
