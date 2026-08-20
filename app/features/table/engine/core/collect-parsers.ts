import type { GenericParserBuilder } from 'nuqs';

import type { UrlBinding } from './url-binding';

/**
 * Flattens bindings into the single parser map consumed by `useQueryStates`,
 * rejecting a physical key claimed by more than one owner so two
 * capabilities cannot silently overwrite each other's URL state.
 */
export function createParserCollector() {
  const parsers: Record<string, GenericParserBuilder<any>> = {};
  const owners = new Map<string, string>();

  function add(owner: string, binding: UrlBinding<any>) {
    for (const [key, parser] of Object.entries(binding.parsers)) {
      if (!key.trim()) {
        throw new Error(`Table query key for ${owner} cannot be empty.`);
      }

      const previousOwner = owners.get(key);
      if (previousOwner) {
        throw new Error(
          `Table query key "${key}" is owned by both ${previousOwner} and ${owner}.`,
        );
      }

      owners.set(key, owner);
      parsers[key] = parser;
    }
  }

  function collect() {
    return {
      parsers: Object.freeze(parsers),
      ownedKeys: Object.freeze([...owners.keys()]),
    };
  }

  return { add, collect };
}
