import ky, { isHTTPError } from 'ky';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createApi, normalizeError } from '../api';
import { ApiContractError } from '../errors';

function createTestClient(body: unknown, status = 200, rawBody = false) {
  return ky.create({
    baseUrl: 'https://api.test/',
    retry: 0,
    hooks: { beforeError: [normalizeError] },
    fetch: async (input) => {
      const response = new Response(rawBody ? String(body) : JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
        status,
      });
      Object.defineProperty(response, 'url', {
        value: input instanceof Request ? input.url : String(input),
      });
      return response;
    },
  });
}

describe('api', () => {
  it('validates and returns endpoint data', async () => {
    const schema = z.object({ message: z.string() });
    const request = createApi(createTestClient({
      code: 'SUCCESS',
      data: { message: 'pong' },
      message: 'ok',
    }));
    const result = request('ping', schema);

    await expect(result).resolves.toEqual({ message: 'pong' });
  });

  it('rejects invalid endpoint data', async () => {
    const schema = z.object({ message: z.string() });
    const request = createApi(createTestClient({
      code: 'SUCCESS',
      data: { message: 1 },
      message: 'ok',
    }));
    const result = request('ping', schema);

    await expect(result).rejects.toThrow();
  });

  it('wraps malformed JSON in an ApiContractError', async () => {
    const request = createApi(createTestClient('{', 200, true));
    const error = await request('ping', z.unknown()).catch(error => error);

    expect(error).toBeInstanceOf(ApiContractError);
    if (!(error instanceof ApiContractError)) {
      throw error;
    }

    expect(error).toMatchObject({
      url: 'https://api.test/api/v1/ping',
      status: 200,
    });
    expect(error.cause).toBeInstanceOf(SyntaxError);
  });

  it('wraps malformed endpoint data in an ApiContractError', async () => {
    const request = createApi(createTestClient({
      code: 'SUCCESS',
      data: { message: 1 },
      message: 'ok',
    }));
    const error = await request('ping', z.object({ message: z.string() })).catch(error => error);

    expect(error).toBeInstanceOf(ApiContractError);
    if (!(error instanceof ApiContractError)) {
      throw error;
    }

    expect(error).toMatchObject({
      url: 'https://api.test/api/v1/ping',
      status: 200,
    });
    expect(error.cause).toBeInstanceOf(z.ZodError);
    expect(error.schemaError).toBe(error.cause);
  });

  it('uses a valid error envelope message for HTTPError', async () => {
    const request = createApi(createTestClient({
      code: 'NOT_FOUND',
      data: null,
      message: 'Song was not found.',
    }, 404));

    const error = await request('ping', z.unknown()).catch(error => error);

    expect(isHTTPError(error)).toBe(true);
    if (!isHTTPError(error)) {
      throw error;
    }

    expect(error.message).toBe('Song was not found.');
  });

  it('keeps Ky HTTPError message for an invalid error envelope', async () => {
    const request = createApi(createTestClient({
      message: 'This message is not trusted.',
    }, 400));

    const error = await request('ping', z.unknown()).catch(error => error);

    expect(isHTTPError(error)).toBe(true);
    if (!isHTTPError(error)) {
      throw error;
    }

    expect(error.message).toMatch(/^Request failed with status code 400/);
    expect(error.message).not.toContain('This message is not trusted.');
  });
});
