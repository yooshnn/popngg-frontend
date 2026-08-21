// @vitest-environment jsdom
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { difficulty } from '~/entities/difficulty';
import { getClientI18n } from '~/shared/i18n/client';
import { difficultyField } from '../difficulty';
import { draft, renderField } from './render-field';
import '@testing-library/jest-dom/vitest';

describe('difficultyField', () => {
  it('drafts an absent selection as every option', () => {
    expect(difficultyField.toDraft(undefined)).toEqual(difficultyField.options);
  });

  it('applies a full selection as absent', () => {
    expect(difficultyField.toApplied(difficultyField.options)).toBeUndefined();
  });

  it('round-trips a partial selection through its binding', () => {
    const selection = difficultyField.toApplied(['normal', 'ex']);
    const written = difficultyField.binding.write(selection);

    expect(difficultyField.binding.read(written as never)).toEqual(['normal', 'ex']);
  });
});

describe('difficultyField render', () => {
  beforeAll(async () => {
    await getClientI18n();
  });

  afterEach(cleanup);

  it('starts with every difficulty checked', () => {
    renderField(difficultyField);

    for (const item of difficulty.all) {
      expect(screen.getByRole('checkbox', { name: difficulty.label(item) }))
        .toBeChecked();
    }
  });

  it('drafts a difficulty out of the selection', () => {
    renderField(difficultyField);

    fireEvent.click(screen.getByRole('checkbox', { name: 'NORMAL' }));

    expect(draft()).toEqual(['light', 'hyper', 'ex']);
  });
});
