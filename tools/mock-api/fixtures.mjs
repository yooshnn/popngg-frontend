import { songs } from './assets/songs.mjs';

export const SESSION_COOKIE = 'popngg_mock_session';

export const SESSION = {
  poptomoId: '2459-4102-3156',
  userName: 'popn.gg',
  avatarUrl: null,
};

export const USER_PROFILE = {
  id: SESSION.poptomoId,
  name: SESSION.userName,
  avatarUrl: null,
  character: '和泉一舞',
  comment: '「スコアよりクリアメダル優先」',
  popnClass: 17800,
  legacyPopnClass: 9850,
  medalSummaries: [
    { kind: 'clear', maxLevel: 50, achieved: 520, total: 1240 },
    { kind: 'full-combo', maxLevel: 49, achieved: 142, total: 1240 },
    { kind: 'perfect', maxLevel: 48, achieved: 24, total: 1240 },
  ],
  updatedAt: '2026-07-29T04:12:00.000Z',
};

export const NEW_SONGS = songs.slice(0, 20);
export const OLD_SONGS = songs.slice(20, 60);
export const LEGACY_TARGETS = songs.slice(0, 50);

const MEDAL_CODES = Array.from({ length: 13 }, (_, index) => index + 1);
const RANK_CODES = Array.from({ length: 13 }, (_, index) => index + 1);

// peakIndex is 0-based against code 1 (best outcome) .. code 13 (worst).
const LEVEL_STATS_ROWS = [
  { level: 1, total: 4, peakIndex: 10, spread: 1.5 },
  { level: 8, total: 15, peakIndex: 8, spread: 2.5 },
  { level: 15, total: 42, peakIndex: 6, spread: 3 },
  { level: 23, total: 87, peakIndex: 4, spread: 3.5 },
  { level: 31, total: 156, peakIndex: 2, spread: 3.5 },
  { level: 38, total: 203, peakIndex: 0, spread: 3 },
  { level: 42, total: 178, peakIndex: 5, spread: 4 },
  { level: 45, total: 22, peakIndex: 6, spread: 3 },
  { level: 46, total: 19, peakIndex: 7, spread: 3 },
  { level: 47, total: 16, peakIndex: 8, spread: 2.5 },
  { level: 48, total: 12, peakIndex: 9, spread: 2 },
  { level: 49, total: 8, peakIndex: 10, spread: 2 },
  { level: 50, total: 3, peakIndex: 11, spread: 1.5 },
];

export const LEVEL_STATS = LEVEL_STATS_ROWS.map(({ level, total, peakIndex, spread }) => ({
  level,
  total,
  medals: toCounts(distribute(total, MEDAL_CODES.length, peakIndex, spread), MEDAL_CODES),
  ranks: toCounts(distribute(total, RANK_CODES.length, peakIndex, spread), RANK_CODES),
}));

function toCounts(counts, codes) {
  return codes.map((code, index) => ({ code, count: counts[index] }));
}

// Bell curve centered on peakIndex; guarantees every slot >=1 once total >= codeCount.
function distribute(total, codeCount, peakIndex, spread) {
  const weights = Array.from({ length: codeCount }, (_, index) => {
    const distance = index - peakIndex;
    return Math.exp(-(distance ** 2) / (2 * spread ** 2));
  });

  if (total < codeCount) {
    const counts = Array.from({ length: codeCount }).fill(0);
    const rankedIndexes = weights
      .map((weight, index) => ({ weight, index }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, total)
      .map(({ index }) => index);

    for (const index of rankedIndexes) {
      counts[index] = 1;
    }

    return counts;
  }

  const remaining = total - codeCount;
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const shares = weights.map(weight => weight / weightSum * remaining);
  const counts = shares.map(share => 1 + Math.floor(share));
  const allocated = counts.reduce((sum, count) => sum + count, 0);

  const remainders = shares
    .map((share, index) => ({ index, fraction: share - Math.floor(share) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < total - allocated; i++) {
    counts[remainders[i].index] += 1;
  }

  return counts;
}
