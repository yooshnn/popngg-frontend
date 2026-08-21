import type { CollectPhase, RenewalPayload } from '~/features/renewal';

// Resolved from hasOpener — is there a bookmarklet channel at all
export type ChannelState
  = | { status: 'checking-opener' }
    | { status: 'no-opener' };

// Resolved from session/gameIdHint/account — who the user is, 'authenticated' once settled
export type IdentityState
  = | { status: 'checking-session' }
    | { status: 'waiting-game-id' }
    | { status: 'checking-account'; gameId: string }
    | { status: 'needs-login'; gameId: string }
    | { status: 'needs-register'; gameId: string }
    | { status: 'account-lookup-failed' }
    | { status: 'authenticated' };

// Resolved from run — what useRenewalHandoff stores while collecting/uploading
export type RunState
  = | { status: 'collecting'; phase: CollectPhase; done: number; total: number }
    | { status: 'uploading' }
    | { status: 'completed'; userId: string }
    // `message` is raw wire/server text kept for diagnostics — the popup renders t(renewal.error.<code>)
    | { status: 'failed'; code: string; message: string | null; payload: RenewalPayload | null };

// The full state the handoff route renders
export type RenewalState = ChannelState | IdentityState | RunState;
