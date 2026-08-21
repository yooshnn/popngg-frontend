import type { RenewalResultDto } from './dto';
import type { RenewalSummary } from '~/features/renewal';

export interface RenewalResult {
  renewedAt: Date;
  summary: RenewalSummary;
}

export function toRenewalResult(dto: RenewalResultDto): RenewalResult {
  return {
    renewedAt: new Date(dto.renewedAt),
    summary: dto.summary,
  };
}
