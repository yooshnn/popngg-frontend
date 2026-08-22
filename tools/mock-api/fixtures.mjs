import { songs } from './assets/songs.mjs';

export const SESSION_COOKIE = 'popngg_mock_session';

export const SESSION = {
  poptomoId: '2459-4102-3156',
  userName: 'popn.gg',
  avatarUrl: null,
};

export const RENEWAL_RESULT = {
  renewedAt: '2026-08-21T04:12:00.000Z',
  summary: {
    chartsScanned: 1240,
    recordsAdded: 18,
    medalsImproved: 7,
    scoresImproved: 12,
    popnClassDelta: 240,
  },
};

export const USER_PROFILE = {
  poptomoId: SESSION.poptomoId,
  userName: SESSION.userName,
  characterName: '和泉一舞',
  comment: '「スコアよりクリアメダル優先」',
  profileImageUrl: null,
  hidden: false,
  displayPopclass: 17800,
  potentialPopclass: 17800,
  legacyPopclass: 9850,
  credits: { normal: 0, extra: 0, timePlay10: 0, timePlay16: 0 },
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
export const RECORDS = songs.map(({ value, ...song }) => ({ ...song, popnClass: value }));

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

// A lower peakIndex means better outcomes are concentrated near code 1, so
// the average score climbs as peakIndex falls.
const PROGRESS_BY_LEVEL_ROWS = LEVEL_STATS_ROWS.map(({ level, total, peakIndex, spread }) => ({
  key: level,
  total,
  averageScore: 62_000 + Math.round((12 - peakIndex) * 2_800),
  peakIndex,
  spread,
}));

const PROGRESS_BY_DIFFICULTY_ROWS = [
  { key: 1, total: 320, averageScore: 91_200, peakIndex: 2, spread: 3 },
  { key: 2, total: 410, averageScore: 85_600, peakIndex: 3, spread: 3 },
  { key: 3, total: 260, averageScore: 76_400, peakIndex: 5, spread: 3.5 },
  { key: 4, total: 130, averageScore: 68_900, peakIndex: 7, spread: 3.5 },
];

export const PROGRESS_BY_LEVEL = toProgress(PROGRESS_BY_LEVEL_ROWS);
export const PROGRESS_BY_DIFFICULTY = toProgress(PROGRESS_BY_DIFFICULTY_ROWS);

function toProgress(specs) {
  const rows = specs.map(({ key, total, averageScore, peakIndex, spread }) => ({
    key,
    total,
    averageScore,
    medals: toCounts(distribute(total, MEDAL_CODES.length, peakIndex, spread), MEDAL_CODES),
    ranks: toCounts(distribute(total, RANK_CODES.length, peakIndex, spread), RANK_CODES),
  }));

  return { rows, summary: summarize(rows) };
}

function summarize(rows) {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const weightedScore = rows.reduce((sum, row) => sum + row.averageScore * row.total, 0);

  return {
    total,
    averageScore: total === 0 ? 0 : Math.round(weightedScore / total),
    medals: mergeCounts(rows.map(row => row.medals), MEDAL_CODES),
    ranks: mergeCounts(rows.map(row => row.ranks), RANK_CODES),
  };
}

function mergeCounts(countLists, codes) {
  return codes.map((code, index) => ({
    code,
    count: countLists.reduce((sum, counts) => sum + counts[index].count, 0),
  }));
}

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
