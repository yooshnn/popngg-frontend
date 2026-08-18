import { z } from 'zod';
import { defineCookie } from '~/shared/cookie';

export const rememberedIdCookie = defineCookie({
  name: 'popngg_remembered_id',
  schema: z.string().regex(/^\d{4}-\d{4}-\d{4}$/).nullable(),
  fallback: null,
});
