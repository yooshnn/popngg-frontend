import { describe, expect, it } from 'vitest';
import { isScriptMessage, SCRIPT_SOURCE, toRenewalErrorCode } from '../protocol';

describe('toRenewalErrorCode', () => {
  it('passes through a known error code', () => {
    expect(toRenewalErrorCode('NOT_LOGGED_IN')).toBe('NOT_LOGGED_IN');
  });

  it('narrows an unknown code to UNKNOWN', () => {
    expect(toRenewalErrorCode('SOMETHING_NEW')).toBe('UNKNOWN');
  });
});

describe('isScriptMessage', () => {
  it('accepts a message from the collector script', () => {
    expect(isScriptMessage({ source: SCRIPT_SOURCE, type: 'hint', gameId: '2459-4102-3156' })).toBe(true);
  });

  it('rejects a message from a different source', () => {
    expect(isScriptMessage({ source: 'popngg-handoff', type: 'hello' })).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isScriptMessage(null)).toBe(false);
    expect(isScriptMessage('popngg-renew')).toBe(false);
  });
});
