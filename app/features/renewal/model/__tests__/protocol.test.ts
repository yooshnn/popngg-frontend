import type { RenewalPayload } from '../protocol';
import { describe, expect, it } from 'vitest';
import { isScriptMessage, SCRIPT_SOURCE, toCollectPhase, toRenewalErrorCode, toWirePayload } from '../protocol';

describe('toCollectPhase', () => {
  it('passes through a known phase', () => {
    expect(toCollectPhase('popnclass')).toBe('popnclass');
  });

  it('narrows an unknown phase to null', () => {
    expect(toCollectPhase('something-new')).toBeNull();
  });

  it('narrows the removed v1 "details" phase to null', () => {
    expect(toCollectPhase('details')).toBeNull();
  });
});

describe('toWirePayload', () => {
  const basePayload: RenewalPayload = {
    collectorVersion: 1,
    game: 'popn29',
    collectedAt: '2026-08-22T00:00:00.000Z',
    profile: { gameId: '2459-4102-3156', name: null, character: null, popnClass: null },
    charts: [],
    popnClass: {
      selected: {
        new: [{
          title: 'ΩVERSOUL',
          genre: 'ΩVERSOUL',
          artist: 'BEMANI Sound Team',
          difficulty: 'ex',
          medal: 'f',
          rank: 'a3',
          score: 90000,
        }],
        old: [],
      },
    },
    warnings: [],
    stats: {
      levelsScanned: 0,
      pagesFetched: 0,
      levelPagesFetched: 0,
      detailsFetched: 0,
      chartsFound: 0,
      chartsPlayed: 0,
      elapsedMs: 0,
      payloadBytes: 0,
    },
  };

  it('emits exactly the keys the backend accepts', () => {
    expect(Object.keys(toWirePayload(basePayload)).sort())
      .toEqual(['charts', 'collectedAt', 'collectorVersion', 'game', 'profile', 'stats', 'warnings']);
  });

  it('drops popnClass, including debug fields the collector may add later', () => {
    const debugPayload = { ...basePayload, popnClass: { ...basePayload.popnClass, total: 178.4 } as never };
    expect(toWirePayload(debugPayload)).not.toHaveProperty('popnClass');
  });

  it('drops levelPagesFetched, which is not in the stats contract', () => {
    const wire = toWirePayload({ ...basePayload, stats: { ...basePayload.stats, levelPagesFetched: 31 } });
    expect(wire.stats).not.toHaveProperty('levelPagesFetched');
    expect(Object.keys(wire.stats).sort()).toEqual([
      'chartsFound',
      'chartsPlayed',
      'detailsFetched',
      'elapsedMs',
      'levelsScanned',
      'pagesFetched',
      'payloadBytes',
    ]);
  });

  it('keeps charts untouched, so chartId and versionBestScore reach the backend', () => {
    const target = {
      chartId: 'Bphwoc7OmreNwltHB5NYZA==',
      title: 'ΩVERSOUL',
      genre: 'ΩVERSOUL',
      artist: 'BEMANI Sound Team',
      difficulty: 'ex',
      medal: 'f',
      rank: 'a3',
      score: 90906,
      versionBestScore: 90906,
    };
    const notPicked = { ...target, versionBestScore: 0 };

    expect(toWirePayload({ ...basePayload, charts: [target, notPicked] }).charts)
      .toEqual([target, notPicked]);
  });
});

describe('toRenewalErrorCode', () => {
  it('passes through a known error code', () => {
    expect(toRenewalErrorCode('NOT_LOGGED_IN')).toBe('NOT_LOGGED_IN');
  });

  it('narrows an unknown code to UNKNOWN', () => {
    expect(toRenewalErrorCode('SOMETHING_NEW')).toBe('UNKNOWN');
  });
});

describe('isScriptMessage', () => {
  it('accepts a message from the collector script', () => {
    expect(isScriptMessage({ source: SCRIPT_SOURCE, type: 'hint', gameId: '2459-4102-3156' })).toBe(true);
  });

  it('rejects a message from a different source', () => {
    expect(isScriptMessage({ source: 'popngg-handoff', type: 'hello' })).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isScriptMessage(null)).toBe(false);
    expect(isScriptMessage('popngg-renew')).toBe(false);
  });
});
