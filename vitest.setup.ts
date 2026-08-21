/**
 * jsdom ships no PointerEvent, which Base UI constructs when a control is
 * activated. MouseEvent carries every property those controls read.
 */
if (typeof window !== 'undefined' && !('PointerEvent' in window))
  window.PointerEvent = window.MouseEvent as typeof window.PointerEvent;
