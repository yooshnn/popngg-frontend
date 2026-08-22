import type { PopnClassTarget } from '../model/types';
import type { PopnClass } from '~/entities/popn-class';

export function totalPopnClass(songs: readonly PopnClassTarget[]): PopnClass {
  return songs.reduce((sum, song) => sum + song.popnClass, 0);
}

export function averagePopnClass(songs: readonly PopnClassTarget[]): PopnClass {
  return songs.length === 0 ? 0 : totalPopnClass(songs) / songs.length;
}

/** Slots the current formula sums over: 20 new songs plus 40 old ones. */
const TARGET_SLOTS = 60;

/**
 * Scales one target's contribution up to the popn class it would produce if every slot matched it.
 * A lone contribution is hard to read; the scaled value sits on the same scale as the player's own
 * popn class, so a card answers "what class does a result like this belong to".
 *
 * Legacy targets need no scaling — that formula averages, so its values are already class-scale.
 */
export function toClassEquivalent(value: PopnClass): PopnClass {
  return value * TARGET_SLOTS;
}
