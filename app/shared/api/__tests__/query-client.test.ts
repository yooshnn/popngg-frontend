import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiContractError } from '../errors';
import { getQueryClient } from '../query-client';

describe('query client retry policy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not retry an ApiContractError', async () => {
    vi.stubEnv('SSR', false);

    const queryClient = getQueryClient();
    const error = new ApiContractError({
      url: 'https://api.test/api/v1/ping',
      status: 200,
      cause: new Error('invalid response'),
    });
    let attempts = 0;

    await expect(queryClient.fetchQuery({
      queryKey: ['contract-error-no-retry'],
      queryFn: async () => {
        attempts += 1;
        throw error;
      },
    })).rejects.toBe(error);

    expect(attempts).toBe(1);
  });
});
