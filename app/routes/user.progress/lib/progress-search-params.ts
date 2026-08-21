import { parseAsStringLiteral } from 'nuqs';
import { axes } from '../model/types';

export const details = ['brief', 'full'] as const;

export type ProgressDetail = (typeof details)[number];

export const progressSearchParams = {
  by: parseAsStringLiteral(axes).withDefault('level'),
  detail: parseAsStringLiteral(details).withDefault('brief'),
};
