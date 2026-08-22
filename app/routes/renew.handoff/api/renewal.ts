import type { RenewalPayload } from '~/features/renewal';
import { toWirePayload } from '~/features/renewal';
import { api } from '~/shared/api';
import { renewalResultDtoSchema } from './dto';
import { toRenewalResult } from './mapper';

export async function renew(payload: RenewalPayload) {
  return toRenewalResult(await api('renewals', renewalResultDtoSchema, {
    method: 'post',
    json: toWirePayload(payload),
  }));
}
