import type { UrlRange } from '../engine/core/url-binding';
import type { TableFormFieldDefinition } from '../engine/form/field-config';

/** Collapses a range with no bounds into an absent value. */
export function compactRange(value: UrlRange): UrlRange | undefined {
  return value.min === undefined && value.max === undefined ? undefined : value;
}

export interface RangeFieldDefinition
  extends TableFormFieldDefinition<UrlRange, UrlRange> {
  min: number;
  max: number;
}
