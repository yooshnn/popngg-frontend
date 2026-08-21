import type { AccountLookup } from './account';
import type { IdentityState, RenewalState, RunState } from './state';
import type { SessionState } from '~/entities/session';

export interface RenewalInputs {
  hasOpener: boolean | null;
  run: RunState | null;
  session: SessionState['status'];
  gameIdHint: string | null;
  account: AccountLookup;
}

function resolveIdentityState(input: RenewalInputs): IdentityState {
  if (input.session === 'pending') {
    return { status: 'checking-session' };
  }
  if (input.session === 'authenticated') {
    return { status: 'authenticated' };
  }
  if (input.gameIdHint === null) {
    return { status: 'waiting-game-id' };
  }
  if (input.account === 'error') {
    return { status: 'account-lookup-failed' };
  }
  if (input.account === 'pending') {
    return { status: 'checking-account', gameId: input.gameIdHint };
  }
  return input.account === 'registered'
    ? { status: 'needs-login', gameId: input.gameIdHint }
    : { status: 'needs-register', gameId: input.gameIdHint };
}

export function resolveRenewalState(input: RenewalInputs): RenewalState {
  if (input.hasOpener === null) {
    return { status: 'checking-opener' };
  }
  if (!input.hasOpener) {
    return { status: 'no-opener' };
  }
  if (input.run) {
    return input.run;
  }
  return resolveIdentityState(input);
}
