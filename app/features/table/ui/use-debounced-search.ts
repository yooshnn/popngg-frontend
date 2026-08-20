import type { ChangeEvent, CompositionEvent, FocusEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

const SEARCH_DEBOUNCE_MS = 300;

interface UseDebouncedSearchOptions {
  value: string | undefined;
  onCommit: (value: string | undefined) => void;
}

export function useDebouncedSearch({ value, onCommit }: UseDebouncedSearchOptions) {
  const location = useLocation();
  const appliedValue = value ?? '';
  const source = `${location.key}:${appliedValue}`;
  const [draftState, setDraftState] = useState({ source, value: appliedValue });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composingRef = useRef(false);
  const flushAfterCompositionRef = useRef(false);
  const draft = draftState.source === source ? draftState.value : appliedValue;

  const cancelPending = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const commit = (nextValue: string) => {
    cancelPending();
    onCommit(nextValue || undefined);
  };

  const schedule = (nextValue: string) => {
    cancelPending();
    timerRef.current = setTimeout(commit, SEARCH_DEBOUNCE_MS, nextValue);
  };

  useEffect(() => cancelPending, [source]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    setDraftState({ source, value: nextValue });

    if (!composingRef.current)
      schedule(nextValue);
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
    cancelPending();
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    composingRef.current = false;
    setDraftState({ source, value: nextValue });

    if (flushAfterCompositionRef.current) {
      flushAfterCompositionRef.current = false;
      commit(nextValue);
      return;
    }

    schedule(nextValue);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (composingRef.current) {
      flushAfterCompositionRef.current = true;
      return;
    }

    commit(event.currentTarget.value);
  };

  return {
    value: draft,
    onBlur: handleBlur,
    onChange: handleChange,
    onCompositionEnd: handleCompositionEnd,
    onCompositionStart: handleCompositionStart,
  };
}
