import { describe, expect, it } from 'vitest';
import { recordsLink } from '../records-link';

describe('recordsLink', () => {
  it('encodes a single medal at one level as a matching range and code', () => {
    const url = recordsLink('u1', 49, { kind: 'medal', values: ['bronze-diamond'] });

    expect(url).toBe('/user/u1/records?levelMin=49&levelMax=49&medal=6');
  });

  it('joins a clear-type group as comma-separated codes', () => {
    const url = recordsLink('u1', 49, {
      kind: 'medal',
      values: ['bronze-star', 'bronze-diamond', 'bronze-circle'],
    });

    expect(url).toBe('/user/u1/records?levelMin=49&levelMax=49&medal=5%2C6%2C7');
  });

  it('encodes a rank selection the same way as the records filter form', () => {
    const url = recordsLink('u1', 49, { kind: 'rank', values: ['A'] });

    expect(url).toBe('/user/u1/records?levelMin=49&levelMax=49&rank=7');
  });
});
