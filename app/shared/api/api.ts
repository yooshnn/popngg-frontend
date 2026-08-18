import type { KyInstance, Options } from 'ky';
import type { output, ZodType } from 'zod';
import type { Api, ApiVersion } from './contracts';
import ky, { isHTTPError } from 'ky';
import { z } from 'zod';
import { envelopeSchema } from './contracts';
import { ApiContractError } from './errors';

// API configuration
const API_ROOT = 'api';
const DEFAULT_API_VERSION: ApiVersion = 'v1';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL is not set.');
}

// Ky client
export const kyInstance = ky.create({
  baseUrl,
  credentials: 'include',
  retry: 0,
  hooks: {
    beforeError: [normalizeError],
  },
});

export const api = createApi(kyInstance);

// Typed API factory
export function createApi(
  client: KyInstance,
  version: ApiVersion = DEFAULT_API_VERSION,
): Api {
  return async <Schema extends ZodType>(
    path: string,
    schema: Schema,
    options?: Options,
  ): Promise<output<Schema>> => {
    const response = await client(joinPath(API_ROOT, version, path), options);

    try {
      const body: unknown = await response.json();
      return envelopeSchema(schema).parse(body).data;
    }
    catch (cause) {
      throw new ApiContractError({
        url: response.url,
        status: response.status,
        cause,
      });
    }
  };
}

// HTTP error normalization
export function normalizeError({ error }: { error: Error }): Error {
  if (!isHTTPError(error)) {
    return error;
  }

  const { data } = error;
  const result = envelopeSchema(z.unknown()).safeParse(data);

  if (result.success) {
    error.message = result.data.message;
  }

  return error;
}

// URL path normalization
function joinPath(...segments: string[]): string {
  return segments
    .map(segment => segment.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
}
