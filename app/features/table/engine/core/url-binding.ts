import type {
  GenericParserBuilder,
  inferParserType,
  Nullable,
} from 'nuqs';

/** The parser map owned by one logical table field. */
export type UrlParserMap = Record<string, GenericParserBuilder<any>>;

/**
 * Connects one logical value to one or more physical URL query keys.
 *
 * A range is a useful example: its value can be `{ min, max }`, while its
 * parser map owns the two physical keys `levelMin` and `levelMax`.
 */
export interface UrlBinding<
  TValue,
  TParsers extends UrlParserMap = UrlParserMap,
> {
  readonly parsers: TParsers;
  read: (values: inferParserType<TParsers>) => TValue | undefined;
  write: (
    value: TValue | undefined,
  ) => Partial<Nullable<inferParserType<TParsers>>>;
}

/** Creates a binding for the common one-logical-value/one-query-key case. */
export function singleKeyBinding<TValue>(
  key: string,
  parser: GenericParserBuilder<TValue>,
): UrlBinding<TValue, Record<string, GenericParserBuilder<TValue>>> {
  return {
    parsers: { [key]: parser },
    read: (values) => {
      const value = values[key];
      return value ?? undefined;
    },
    write: value => ({ [key]: value ?? null }),
  };
}

/** Appends a binding's canonical wire representation to a query string. */
export function writeBinding<TValue>(
  params: URLSearchParams,
  binding: UrlBinding<TValue>,
  value: TValue | undefined,
) {
  const patch = binding.write(value);

  for (const [key, rawValue] of Object.entries(patch)) {
    params.delete(key);

    if (rawValue == null)
      continue;

    if (!(key in binding.parsers))
      throw new Error(`Binding wrote an undeclared table query key "${key}".`);

    const parser = binding.parsers[key];
    const serialized = parser.serialize(rawValue);
    for (const item of Array.isArray(serialized) ? serialized : [serialized]) {
      params.append(key, item);
    }
  }
}
