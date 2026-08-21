// @vitest-environment jsdom
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { medal } from '~/entities/medal';
import { getClientI18n } from '~/shared/i18n/client';
import ko from '~/shared/i18n/locales/ko/common';
import { medalField } from '../medal';
import { draft, renderField } from './render-field';
import '@testing-library/jest-dom/vitest';

describe('medalField', () => {
  it('drafts an absent selection as every option', () => {
    expect(medalField.toDraft(undefined)).toEqual(medalField.options);
  });

  it('applies a full selection as absent', () => {
    expect(medalField.toApplied(medalField.options)).toBeUndefined();
  });

  it('round-trips a partial selection through its binding', () => {
    const selection = medalField.toApplied(['gold-star', 'easy']);
    const written = medalField.binding.write(selection);

    expect(medalField.binding.read(written as never)).toEqual(['gold-star', 'easy']);
  });

  it('partitions every option across its groups', () => {
    const members = medalField.groups.flatMap(group => [...group.members]);

    expect([...members].sort()).toEqual([...medal.all].sort());
  });

  it('toggles a gold star with full combo, leaving no perfect group', () => {
    const groups = Object.fromEntries(
      medalField.groups.map(group => [group.id, group.members]),
    );

    expect(groups['full-combo']).toEqual([
      'gold-star',
      'silver-star',
      'silver-diamond',
      'silver-circle',
    ]);
    expect(medalField.groups.map(group => group.id)).toEqual([
      'full-combo',
      'clear',
      'assist',
      'failed',
    ]);
  });
});

describe('medalField render', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('marks a group pressed while all of its members are selected', () => {
    renderField(medalField);

    for (const group of medalField.groups) {
      expect(screen.getByRole('button', { name: ko.medal.clearType[group.id] }))
        .toHaveAttribute('aria-pressed', 'true');
    }
  });

  it('drafts a whole group out of the selection', () => {
    renderField(medalField);

    fireEvent.click(
      screen.getByRole('button', { name: ko.medal.clearType['full-combo'] }),
    );

    expect(draft()).not.toContain('gold-star');
    expect(draft()).not.toContain('silver-star');
    expect(draft()).toContain('bronze-star');
  });

  it('drafts one member out of the selection', () => {
    renderField(medalField);

    fireEvent.click(screen.getByRole('checkbox', { name: ko.medal.name.easy }));

    expect(draft()).not.toContain('easy');
    expect(draft()).toContain('long-off');
  });
});
