import { parseAsStringLiteral } from 'nuqs';

export const views = ['list', 'card'] as const;

export type View = (typeof views)[number];

export const viewSearchParams = {
  view: parseAsStringLiteral(views).withDefault('list'),
};
