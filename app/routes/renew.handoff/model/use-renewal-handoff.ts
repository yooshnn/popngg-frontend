import type { RenewalState, RunState } from './state';
import type { HandoffMessage } from '~/features/renewal';
import { useMutation } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from '~/entities/session';
import { HANDOFF_SOURCE } from '~/features/renewal';
import { renew } from '../api/renewal';
import { useAccountLookup } from './account';
import { postToOpener, useHasOpener, usePing, useScriptMessages } from './channel';
import { resolveRenewalState } from './resolve';

export function useRenewalHandoff() {
  const session = useSession();
  const hasOpener = useHasOpener();
  const [run, setRun] = useState<RunState | null>(null);
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
      setRun((current) => {
        if (current?.status === 'uploading' || current?.status === 'completed') {
          return current;
        }
        return { status: 'collecting', phase: message.phase, done: message.done, total: message.total };
      });
      return;
    }

    if (message.type === 'payload') {
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

  return { state, retry };
}
