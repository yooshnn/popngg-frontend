import type {
  GenericParserBuilder,
  inferParserType,
  Nullable,
} from 'nuqs';
import { parseAsInteger, parseAsString } from 'nuqs';

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

/** An inclusive numeric range where either bound may be absent. */
export interface UrlRange {
  min?: number;
  max?: number;
}

export interface RangeBounds {
  min: number;
  max: number;
}

export type RangeValidationIssue = 'integer' | 'outOfBounds' | 'reversed';

export function getRangeValidationIssue(
  value: UrlRange | undefined,
  bounds: RangeBounds,
): RangeValidationIssue | undefined {
  if (!value)
    return undefined;

  const declared = [value.min, value.max].filter(bound => bound !== undefined);

  if (!declared.every(bound => Number.isInteger(bound)))
    return 'integer';

  if (!declared.every(bound => bound >= bounds.min && bound <= bounds.max))
    return 'outOfBounds';

  if (value.min !== undefined && value.max !== undefined && value.min > value.max)
    return 'reversed';

  return undefined;
}

/**
 * Creates a binding pairing two integer query keys into one range value.
 *
 * A range falling outside its bounds is discarded rather than clamped, so a
 * hand-edited URL seeds the form with its default instead of a broken range.
 */
export function rangeBinding(
  minKey: string,
  maxKey: string,
  bounds: RangeBounds,
): UrlBinding<UrlRange, Record<string, GenericParserBuilder<number>>> {
  return {
    parsers: { [minKey]: parseAsInteger, [maxKey]: parseAsInteger },
    read: (values) => {
      const min = values[minKey] ?? undefined;
      const max = values[maxKey] ?? undefined;

      if (min === undefined && max === undefined)
        return undefined;

      const range = { min, max };

      return getRangeValidationIssue(range, bounds) ? undefined : range;
    },
    write: value => ({
      [minKey]: value?.min ?? null,
      [maxKey]: value?.max ?? null,
    }),
  };
}

/** A string enum whose members map to and from stable numeric wire codes. */
export interface NumericCodeEntity<TValue extends string> {
  all: readonly TValue[];
  code: (value: NoInfer<TValue>) => number;
  from: (code: number) => NoInfer<TValue> | null;
}

/**
 * Creates a binding holding a subset of an entity's members in one query key,
 * as its comma-joined numeric codes.
 *
 * Selecting every member carries the same meaning as selecting none, so both
 * canonicalize to an absent query key. Unrecognized codes are dropped rather
 * than rejected, because URL state is external input.
 */
export function selectionBinding<TValue extends string>(
  key: string,
  entity: NumericCodeEntity<TValue>,
): UrlBinding<readonly TValue[], Record<string, GenericParserBuilder<string>>> {
  const canonicalize = (values: Iterable<TValue>) => {
    const selected = new Set(values);
    return entity.all.filter(value => selected.has(value));
  };

  return {
    parsers: { [key]: parseAsString },
    read: (values) => {
      const raw = values[key];

      if (!raw)
        return undefined;

      const decoded = raw
        .split(',')
        .map(part => entity.from(Number(part)))
        .filter(value => value !== null);
      const selection = canonicalize(decoded);

      return selection.length === 0 || selection.length === entity.all.length
        ? undefined
        : selection;
    },
    write: (value) => {
      const selection = value ? canonicalize(value) : [];

      return {
        [key]: selection.length === 0 || selection.length === entity.all.length
          ? null
          : selection.map(entity.code).join(','),
      };
    },
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
