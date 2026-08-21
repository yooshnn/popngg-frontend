// @vitest-environment jsdom
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { rank, rankFamily } from '~/entities/rank';
import { getClientI18n } from '~/shared/i18n/client';
import ko from '~/shared/i18n/locales/ko/common';
import { rankField } from '../rank';
import { draft, renderField } from './render-field';
import '@testing-library/jest-dom/vitest';

describe('rankField', () => {
  it('drafts an absent selection as every option', () => {
    expect(rankField.toDraft(undefined)).toEqual(rankField.options);
  });

  it('applies a full selection as absent', () => {
    expect(rankField.toApplied(rankField.options)).toBeUndefined();
  });

  it('round-trips a partial selection through its binding', () => {
    const selection = rankField.toApplied(['S+', 'AA']);
    const written = rankField.binding.write(selection);

    expect(rankField.binding.read(written as never)).toEqual(['S+', 'AA']);
  });

  it('partitions every option across its groups', () => {
    const members = rankField.groups.flatMap(group => [...group.members]);

    expect([...members].sort()).toEqual([...rank.all].sort());
  });

  it('toggles AAA with 90+ and the A family with 72+', () => {
    const groups = Object.fromEntries(
      rankField.groups.map(group => [group.id, group.members]),
    );

    expect(groups.AA).toEqual(['AAA', 'AA+', 'AA']);
    expect(groups.B).toEqual(['A+', 'A', 'B+', 'B']);
    expect(rankField.groups.map(group => group.id)).toEqual([
      'S',
      'AA',
      'B',
      'belowB',
    ]);
  });
});

describe('rankField render', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('labels each group by the score it starts at', () => {
    renderField(rankField);

    for (const group of rankField.groups) {
      expect(screen.getByRole('button', { name: rankFamily.scoreLabel(group.id) }))
        .toHaveAttribute('aria-pressed', 'true');
    }
  });

  it('drafts a whole group out of the selection', () => {
    renderField(rankField);

    fireEvent.click(screen.getByRole('button', { name: '98+' }));

    expect(draft()).not.toContain('S+');
    expect(draft()).not.toContain('S');
    expect(draft()).toContain('AAA');
  });

  it('drafts one member out of the selection', () => {
    renderField(rankField);

    fireEvent.click(screen.getByRole('checkbox', { name: ko.rank.name.AAA }));

    expect(draft()).not.toContain('AAA');
    expect(draft()).toContain('S');
  });
});
