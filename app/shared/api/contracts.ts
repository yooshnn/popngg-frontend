import type { Options } from 'ky';
import { z } from 'zod';

export type ApiVersion = 'v1';

export type Api = <Schema extends z.ZodType>(
  path: string,
  schema: Schema,
  options?: Options,
) => Promise<z.output<Schema>>;

export interface Envelope<T> {
  code: string;
  data: T;
  message: string;
}

export function envelopeSchema<Schema extends z.ZodType>(
  dataSchema: Schema,
) {
  return z.object({
    code: z.string(),
    data: dataSchema.nonoptional(),
    message: z.string(),
  });
}

export interface Page<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function pageSchema<Schema extends z.ZodType>(itemSchema: Schema) {
  return z.object({
    items: z.array(itemSchema.nonoptional()),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    hasPrev: z.boolean(),
    hasNext: z.boolean(),
  });
}
