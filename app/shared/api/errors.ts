import { z } from 'zod';

export interface ApiContractErrorOptions {
  url: string;
  status: number;
  cause: unknown;
}

export class ApiContractError extends Error {
  readonly url: string;
  readonly status: number;
  readonly cause: unknown;
  readonly schemaError: z.ZodError | undefined;

  constructor({ url, status, cause }: ApiContractErrorOptions) {
    super(`API response contract violation: ${url || 'unknown URL'} (${status})`, { cause });
    this.name = 'ApiContractError';
    this.url = url;
    this.status = status;
    this.cause = cause;
    this.schemaError = cause instanceof z.ZodError ? cause : undefined;
  }
}
