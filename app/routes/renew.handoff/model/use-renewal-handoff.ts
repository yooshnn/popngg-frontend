import type { RenewalState, RunState } from './state';
import type { HandoffMessage, RenewalSummary } from '~/features/renewal';
import { useMutation } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '~/entities/session';
import { HANDOFF_SOURCE, toCollectPhase } from '~/features/renewal';
import { renew } from '../api/renewal';
import { useAccountLookup } from './account';
import { postToOpener, useHasOpener, usePing, useScriptMessages } from './channel';
import { resolveRenewalState } from './resolve';

// Runs upload to /renewals. Append ?preview to the handoff URL to stop at the preview screen instead —
// the payload is still collected, just not sent, which is how you eyeball a payload without a rebuild.
const PREVIEW_PARAM = 'preview';

function uploadEnabled() {
  if (typeof window === 'undefined') {
    return true;
  }
  return !new URLSearchParams(window.location.search).has(PREVIEW_PARAM);
}

const EMPTY_SUMMARY: RenewalSummary = {
  chartsScanned: 0,
  recordsAdded: 0,
  medalsImproved: 0,
  scoresImproved: 0,
  popnClassDelta: null,
};

export function useRenewalHandoff() {
  const session = useSession();
  const hasOpener = useHasOpener();
  const [run, setRun] = useState<RunState | null>(null);
  const [skipRequested, setSkipRequested] = useState(false);
  const skipSentRef = useRef(false);
  const [gameIdHint, setGameIdHint] = useState<string | null>(null);
  const account = useAccountLookup(gameIdHint);

  const { mutate } = useMutation({
    mutationFn: renew,
    onSuccess: (result, payload) => {
      setRun({ status: 'completed', userId: payload.profile.gameId });
      postToOpener({ source: HANDOFF_SOURCE, type: 'finished', summary: result.summary });
    },
    onError: (error, payload) => {
      if (isHTTPError(error) && error.response.status === 403) {
        // No payload: re-uploading the same records under the same account 403s again
        setRun({ status: 'failed', code: 'GAME_ID_MISMATCH', message: error.message, payload: null });
        return;
      }
      setRun({ status: 'failed', code: 'UPLOAD_FAILED', message: error.message, payload });
    },
  });

  const state: RenewalState = useMemo(
    () => resolveRenewalState({ hasOpener, run, session: session.status, gameIdHint, account }),
    [hasOpener, run, session.status, gameIdHint, account],
  );

  const gameId = session.status === 'authenticated' ? session.session.id : null;

  const ping = useMemo<HandoffMessage | null>(() => {
    if (state.status === 'waiting-game-id') {
      return { source: HANDOFF_SOURCE, type: 'hello' };
    }
    if (state.status === 'authenticated' && gameId !== null) {
      return { source: HANDOFF_SOURCE, type: 'ready', gameId };
    }
    return null;
  }, [state.status, gameId]);

  useEffect(() => {
    if (state.status === 'account-lookup-failed') {
      postToOpener({ source: HANDOFF_SOURCE, type: 'abort', reason: '계정 조회에 실패했습니다.' });
    }
  }, [state.status]);

  usePing(ping, (sent) => {
    const code = sent.type === 'hello' ? 'HANDOFF_NO_RESPONSE' : 'COLLECT_NOT_STARTED';
    setRun({ status: 'failed', code, message: null, payload: null });
  });

  useScriptMessages(hasOpener === true, (message) => {
    if (message.type === 'hint') {
      setGameIdHint(message.gameId);
      return;
    }

    if (message.type === 'progress') {
      const phase = toCollectPhase(message.phase);

      // postMessage has no delivery guarantee, so one lost 'skip' would strand the user in the
      // scan they asked to leave. Re-asserting on every tick of the skippable phases self-heals.
      if (skipRequested && !message.skipped && (phase === 'newsongs' || phase === 'popnclass')) {
        skipSentRef.current = true;
        postToOpener({ source: HANDOFF_SOURCE, type: 'skip', target: 'popnclass' });
      }

      setRun((current) => {
        if (current?.status === 'preview' || current?.status === 'uploading' || current?.status === 'completed') {
          return current;
        }
        return {
          status: 'collecting',
          progress: {
            phase,
            done: message.done,
            total: message.total,
            records: message.records ?? null,
            level: message.level ?? null,
            details: message.details ?? null,
            skipped: message.skipped ?? false,
          },
        };
      });
      return;
    }

    if (message.type === 'payload') {
      if (!uploadEnabled()) {
        setRun({ status: 'preview', payload: message.payload });
        postToOpener({ source: HANDOFF_SOURCE, type: 'finished', summary: EMPTY_SUMMARY });
        return;
      }
      setRun({ status: 'uploading' });
      mutate(message.payload);
      return;
    }

    setRun({ status: 'failed', code: message.code, message: message.message, payload: null });
  });

  const retry = useCallback(() => {
    if (state.status !== 'failed' || state.payload === null) {
      return;
    }
    setRun({ status: 'uploading' });
    mutate(state.payload);
  }, [state, mutate]);

  /**
   * Records the intent; the progress handler is what puts it on the wire, once the run actually
   * reaches a skippable phase. That delay is the feature — until then nothing has been sent, so
   * the user can still change their mind. Past that point the collector's flag is one-way.
   */
  const skipPopnClass = useCallback((skip: boolean) => {
    if (!skip && skipSentRef.current) {
      return;
    }
    setSkipRequested(skip);
  }, []);

  return { state, retry, skipRequested, skipSettled: skipSentRef.current, skipPopnClass };
}
