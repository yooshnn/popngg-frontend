import type { CollectProgress as CollectProgressData } from '~/features/renewal';
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { getClientI18n } from '~/shared/i18n/client';
import { CollectProgress } from '../collect-progress';
import '@testing-library/jest-dom/vitest';

const baseProgress: CollectProgressData = {
  phase: 'levels',
  done: 2,
  total: 8,
  records: 640,
  level: null,
  details: null,
  skipped: false,
};

function renderProgress(
  progress: Partial<CollectProgressData> = {},
  skip: { skipRequested?: boolean; skipSettled?: boolean } = {},
) {
  const merged = { ...baseProgress, ...progress };
  const onSkip = vi.fn();

  render(
    <CollectProgress
      onSkip={onSkip}
      phase={merged.phase!}
      progress={merged}
      skipRequested={skip.skipRequested ?? false}
      skipSettled={skip.skipSettled ?? false}
    />,
  );

  return onSkip;
}

describe('collectProgress', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('offers the skip control while collecting', () => {
    const onSkip = renderProgress();

    fireEvent.click(screen.getByRole('button', { name: '팝클 대상곡 계산 스킵' }));
    expect(onSkip).toHaveBeenCalledWith(true);
  });

  it('lets the user change their mind until the collector is told', () => {
    const onSkip = renderProgress({}, { skipRequested: true, skipSettled: false });

    fireEvent.click(screen.getByRole('button', { name: '스킵 취소하기' }));
    expect(onSkip).toHaveBeenCalledWith(false);
  });

  it('drops the float once the skip has gone over the wire', () => {
    renderProgress({}, { skipRequested: true, skipSettled: true });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByText('건너뜀')).toHaveLength(2);
  });

  it('marks both popclass steps as skipped, since newsongs only feeds the scan', () => {
    renderProgress({}, { skipRequested: true });

    expect(screen.getAllByText('건너뜀')).toHaveLength(2);
  });

  it('keeps popclass marked skipped after the run finishes', () => {
    renderProgress({ phase: 'done', skipped: true });

    expect(screen.getAllByText('건너뜀')).toHaveLength(2);
  });

  it('draws a bar for phases with a known total, but not for popclass', () => {
    renderProgress();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    cleanup();

    renderProgress({ phase: 'popnclass', level: 47, details: 12, total: 4 });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText(/레벨 47 · 상세 12건/)).toBeInTheDocument();
  });

  it('hides the skip control once collection is done', () => {
    renderProgress({ phase: 'done' });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
