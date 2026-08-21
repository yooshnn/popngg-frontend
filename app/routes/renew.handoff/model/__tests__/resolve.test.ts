import type { RenewalInputs } from '../resolve';
import { describe, expect, it } from 'vitest';
import { resolveRenewalState } from '../resolve';

function inputs(overrides: Partial<RenewalInputs> = {}): RenewalInputs {
  return {
    hasOpener: true,
    run: null,
    session: 'anonymous',
    gameIdHint: null,
    account: 'pending',
    ...overrides,
  };
}

describe('resolveRenewalState', () => {
  it('reports checking-opener while hasOpener is unknown', () => {
    expect(resolveRenewalState(inputs({ hasOpener: null }))).toEqual({ status: 'checking-opener' });
  });

  it('reports no-opener once hasOpener resolves to false', () => {
    expect(resolveRenewalState(inputs({ hasOpener: false }))).toEqual({ status: 'no-opener' });
  });

  it('prefers an active run over identity resolution', () => {
    const run = { status: 'uploading' } as const;
    expect(resolveRenewalState(inputs({ run, session: 'authenticated' }))).toEqual(run);
  });

  it('reports checking-session while the session is pending', () => {
    expect(resolveRenewalState(inputs({ session: 'pending' }))).toEqual({ status: 'checking-session' });
  });

  it('reports authenticated once the session resolves', () => {
    expect(resolveRenewalState(inputs({ session: 'authenticated' }))).toEqual({ status: 'authenticated' });
  });

  it('reports waiting-game-id when there is no hint yet', () => {
    expect(resolveRenewalState(inputs({ gameIdHint: null }))).toEqual({ status: 'waiting-game-id' });
  });

  it('reports account-lookup-failed when the lookup errors', () => {
    expect(resolveRenewalState(inputs({ gameIdHint: '2459-4102-3156', account: 'error' })))
      .toEqual({ status: 'account-lookup-failed' });
  });

  it('reports checking-account while the lookup is pending', () => {
    expect(resolveRenewalState(inputs({ gameIdHint: '2459-4102-3156', account: 'pending' })))
      .toEqual({ status: 'checking-account', gameId: '2459-4102-3156' });
  });

  it('reports needs-login when the account is already registered', () => {
    expect(resolveRenewalState(inputs({ gameIdHint: '2459-4102-3156', account: 'registered' })))
      .toEqual({ status: 'needs-login', gameId: '2459-4102-3156' });
  });

  it('reports needs-register when the account is not registered', () => {
    expect(resolveRenewalState(inputs({ gameIdHint: '2459-4102-3156', account: 'unregistered' })))
      .toEqual({ status: 'needs-register', gameId: '2459-4102-3156' });
  });
});
