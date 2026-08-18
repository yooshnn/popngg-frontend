import type { Envelope, Page } from '../contracts';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { z } from 'zod';
import { envelopeSchema, pageSchema } from '../contracts';

describe('response contracts', () => {
  it('validates an envelope with endpoint data', () => {
    const schema = envelopeSchema(z.object({ id: z.string() }));

    expect(schema.parse({
      code: 'SUCCESS',
      data: { id: 'song-1' },
      message: 'The request is successful.',
    })).toEqual({
      code: 'SUCCESS',
      data: { id: 'song-1' },
      message: 'The request is successful.',
    });
  });

  it('rejects an envelope without its required fields', () => {
    const schema = envelopeSchema(z.object({ id: z.string() }));

    expect(() => schema.parse({ data: { id: 'song-1' } })).toThrow();
    expect(() => schema.parse({ code: 'SUCCESS', message: 'ok' })).toThrow();
    expect(() => schema.parse({
      code: 'SUCCESS',
      data: { id: 1 },
      message: 'ok',
    })).toThrow();
  });

  it('keeps envelope data required when the endpoint schema is optional', () => {
    const schema = envelopeSchema(z.string().optional());

    expect(() => schema.parse({
      code: 'SUCCESS',
      message: 'ok',
    })).toThrow();
  });

  it('composes an envelope around a page schema', () => {
    const schema = envelopeSchema(pageSchema(z.object({ id: z.string() })));

    expectTypeOf<z.output<typeof schema>>().toEqualTypeOf<Envelope<Page<{ id: string }>>>();

    expect(schema.parse({
      code: 'SUCCESS',
      data: {
        items: [{ id: 'song-1' }],
        totalItems: 1,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      },
      message: 'ok',
    }).data.items[0].id).toBe('song-1');

    expect(() => schema.parse({
      code: 'SUCCESS',
      data: {
        items: [{ id: 1 }],
        totalItems: 1,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      },
      message: 'ok',
    })).toThrow();

    expect(() => schema.parse({
      code: 'SUCCESS',
      data: {
        items: [],
        totalItems: -1,
        totalPages: 0,
        hasPrev: false,
        hasNext: false,
      },
      message: 'ok',
    })).toThrow();
  });

  it('preserves transformed endpoint output types', () => {
    const schema = envelopeSchema(z.object({
      createdAt: z.string().transform(value => new Date(value)),
    }));
    const result = schema.parse({
      code: 'SUCCESS',
      data: { createdAt: '2026-01-01T00:00:00.000Z' },
      message: 'ok',
    }).data;

    expectTypeOf<z.input<typeof schema>>().toEqualTypeOf<Envelope<{
      createdAt: string;
    }>>();
    expectTypeOf<z.output<typeof schema>>().toEqualTypeOf<Envelope<{
      createdAt: Date;
    }>>();
    expectTypeOf(result.createdAt).toEqualTypeOf<Date>();
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
