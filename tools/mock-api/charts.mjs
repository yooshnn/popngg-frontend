import { artists } from './assets/artists.mjs';
import { songs } from './assets/songs.mjs';

export class InvalidChartsQueryError extends Error {}

const PAGE_SIZES = [20, 50, 100];
const SORT_KEYS = ['version', 'title', 'genre', 'maxLevel'];
const DIFFICULTY_CODES = [1, 2, 3, 4];
const LEVEL_BOUNDS = { min: 1, max: 50 };

const charts = createCharts();

export function getCharts(searchParams) {
  const query = parseChartsQuery(searchParams);
  const filtered = charts.filter(song => matchesQuery(song, query));
  const sorted = [...filtered].sort((left, right) => compareSongs(left, right, query));

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / query.size);
  const start = (query.page - 1) * query.size;

  return {
    items: sorted.slice(start, start + query.size),
    totalItems,
    totalPages,
    hasPrev: query.page > 1 && totalItems > 0,
    hasNext: query.page < totalPages,
  };
}

export function getChart(songHash) {
  return charts.find(song => song.songHash === songHash) ?? null;
}

function createCharts() {
  return songs.map((song, index) => {
    const ex = clampLevel(song.level);
    const hyper = clampLevel(ex - 1 - (index % 6));
    const normal = clampLevel(hyper - 1 - ((index * 3) % 8));
    const light = clampLevel(normal - 1 - ((index * 5) % 6));
    const hasLight = index % 4 !== 3;

    const chartsForSong = [
      hasLight && { difficulty: 1, level: light },
      { difficulty: 2, level: normal },
      { difficulty: 3, level: hyper },
      { difficulty: 4, level: ex },
    ].filter(Boolean);

    return {
      songHash: song.id,
      title: song.title,
      genre: song.genre,
      artist: artists[song.id],
      bannerUrl: song.bannerUrl,
      version: song.version,
      isUpper: song.title.includes('(UPPER)'),
      charts: chartsForSong,
    };
  });
}

function clampLevel(level) {
  return Math.min(LEVEL_BOUNDS.max, Math.max(LEVEL_BOUNDS.min, level));
}

function matchesQuery(song, query) {
  if (query.q) {
    const text = `${song.title} ${song.genre}`.toLocaleLowerCase();
    if (!text.includes(query.q))
      return false;
  }

  if (query.version !== undefined && song.version !== query.version)
    return false;

  if (query.difficulty || query.levelMin !== undefined || query.levelMax !== undefined) {
    return song.charts.some((chart) => {
      if (query.difficulty && !query.difficulty.has(chart.difficulty))
        return false;
      if (query.levelMin !== undefined && chart.level < query.levelMin)
        return false;
      if (query.levelMax !== undefined && chart.level > query.levelMax)
        return false;
      return true;
    });
  }

  return true;
}

function compareSongs(left, right, query) {
  const direction = query.order === 'asc' ? 1 : -1;
  const difference = compare(left, right, query.sort);

  return (difference !== 0 ? difference * direction : 0)
    || left.songHash.localeCompare(right.songHash);
}

function compare(left, right, sort) {
  if (sort === 'title') {
    return left.title.localeCompare(right.title);
  }

  if (sort === 'genre') {
    return left.genre.localeCompare(right.genre);
  }

  if (sort === 'maxLevel') {
    return maxLevel(left) - maxLevel(right);
  }

  return left.version - right.version;
}

function maxLevel(song) {
  return Math.max(...song.charts.map(chart => chart.level));
}

function parseChartsQuery(searchParams) {
  const q = parseSearch(searchParams);
  const version = parseOptionalInteger(searchParams, 'version');
  const levelMin = parseLevelBound(searchParams, 'levelMin');
  const levelMax = parseLevelBound(searchParams, 'levelMax');
  const difficulty = parseDifficulty(searchParams);
  const sort = searchParams.get('sort') ?? 'version';
  const order = searchParams.get('order') ?? 'desc';
  const page = parsePositiveInteger(searchParams, 'page', 1);
  const size = parsePositiveInteger(searchParams, 'size', 20);

  if (!SORT_KEYS.includes(sort)) {
    throw new InvalidChartsQueryError(`Invalid sort: ${sort}`);
  }

  if (order !== 'asc' && order !== 'desc') {
    throw new InvalidChartsQueryError(`Invalid order: ${order}`);
  }

  if (!PAGE_SIZES.includes(size)) {
    throw new InvalidChartsQueryError(`Invalid size: ${size}`);
  }

  if (levelMin !== undefined && levelMax !== undefined && levelMin > levelMax) {
    throw new InvalidChartsQueryError('levelMin must not be greater than levelMax');
  }

  return { q, version, levelMin, levelMax, difficulty, sort, order, page, size };
}

function parseSearch(searchParams) {
  const value = searchParams.get('q')?.trim().toLocaleLowerCase() ?? '';

  if (value.length > 50) {
    throw new InvalidChartsQueryError(`Invalid q: ${value}`);
  }

  return value || undefined;
}

function parseLevelBound(searchParams, key) {
  const value = parseOptionalInteger(searchParams, key);

  if (value !== undefined && (value < LEVEL_BOUNDS.min || value > LEVEL_BOUNDS.max)) {
    throw new InvalidChartsQueryError(`Invalid ${key}: ${value}`);
  }

  return value;
}

function parseDifficulty(searchParams) {
  const raw = searchParams.get('difficulty');
  if (!raw)
    return undefined;

  const values = raw.split(',').map(value => Number(value));
  if (values.some(value => !DIFFICULTY_CODES.includes(value))) {
    throw new InvalidChartsQueryError(`Invalid difficulty: ${raw}`);
  }

  return new Set(values);
}

function parseOptionalInteger(searchParams, key) {
  const raw = searchParams.get(key);
  if (raw === null || raw === '')
    return undefined;

  if (!/^\d+$/.test(raw)) {
    throw new InvalidChartsQueryError(`Invalid ${key}: ${raw}`);
  }

  return Number(raw);
}

function parsePositiveInteger(searchParams, key, fallback) {
  const raw = searchParams.get(key);
  if (raw === null || raw === '') {
    return fallback;
  }

  if (!/^\d+$/.test(raw)) {
    throw new InvalidChartsQueryError(`Invalid ${key}: ${raw}`);
  }

  const value = Number(raw);
  if (value < 1) {
    throw new InvalidChartsQueryError(`Invalid ${key}: ${value}`);
  }

  return value;
}
