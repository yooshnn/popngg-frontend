import { parseAsStringLiteral } from 'nuqs';
import { popnClassTargetViews } from '../model/types';

export const popnClassTargetSearchParams = {
  view: parseAsStringLiteral(popnClassTargetViews).withDefault('potential'),
};
