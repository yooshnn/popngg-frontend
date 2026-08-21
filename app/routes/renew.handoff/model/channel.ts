import type { HandoffMessage, ScriptMessage } from '~/features/renewal';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { EAGATE_ORIGIN, isScriptMessage } from '~/features/renewal';

const PING_INTERVAL_MS = 500;
const PING_LIMIT = 10;

/**
 * Stable-identity wrapper that always calls the latest `handler`.
 * Lets callers pass inline arrows without re-subscribing.
 */
function useLatestHandler<A extends unknown[]>(handler: (...args: A) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  return useCallback((...args: A) => ref.current(...args), []);
}

/**
 * Whether this tab has an opener — `null` until known on the client.
 * Server snapshot must stay `null`, not `false`, or "no opener" ships in the server HTML.
 */
export function useHasOpener() {
  return useSyncExternalStore<boolean | null>(
    () => () => {},
    () => window.opener != null,
    () => null,
  );
}

/** Sends one message to the opener tab. No-op if it's gone or closed. */
export function postToOpener(message: HandoffMessage) {
  const opener = window.opener as Window | null;
  if (opener && !opener.closed) {
    opener.postMessage(message, EAGATE_ORIGIN);
  }
}

/**
 * Repeats `message` every PING_INTERVAL_MS until it becomes `null`.
 * Calls `onExhausted` after PING_LIMIT unanswered sends.
 * `message` must be memoized — a new identity restarts the run.
 */
export function usePing(message: HandoffMessage | null, onExhausted: (message: HandoffMessage) => void) {
  const exhausted = useLatestHandler(onExhausted);

  useEffect(() => {
    if (message === null) {
      return;
    }

    let remaining = PING_LIMIT;
    const send = () => {
      postToOpener(message);
      remaining -= 1;
    };

    send();
    const timer = setInterval(() => {
      if (remaining > 0) {
        send();
        return;
      }
      clearInterval(timer);
      exhausted(message);
    }, PING_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [message, exhausted]);
}

/**
 * Listens for ScriptMessages from the opener while `enabled`.
 * Trust boundary: drops anything not from EAGATE_ORIGIN or wrong shape.
 */
export function useScriptMessages(enabled: boolean, onMessage: (message: ScriptMessage) => void) {
  const handle = useLatestHandler(onMessage);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function listen(event: MessageEvent) {
      if (event.origin === EAGATE_ORIGIN && isScriptMessage(event.data)) {
        handle(event.data);
      }
    }

    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, [enabled, handle]);
}
