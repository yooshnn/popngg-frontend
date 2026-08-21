export class InvalidUsersQueryError extends Error {}

const TOTAL_USERS = 248;
const SORT_KEYS = ['rank', 'name', 'clearLevel', 'updatedAt'];
const PAGE_SIZES = [20, 50, 100];
const LATEST_UPDATED_AT = Date.now();
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const NAME_LENGTH = { min: 1, max: 6 };
const NAME_CHARACTERS = [[0x3042, 0x3093], [0x30A2, 0x30F3], [0xFF21, 0xFF3A]]
  .flatMap(([first, last]) => Array.from(
    { length: last - first + 1 },
    (_, offset) => String.fromCodePoint(first + offset),
  ));

const COMMENTS = [
  '좋아하는 곡을 천천히 플레이하며 메달을 모으고 있어요',
  '고레벨 채보를 중심으로 매일 기록을 갱신하고 있습니다',
  '好きな曲を好きなだけ',
  '98kを目標にスコア詰め中',
  '階段譜面が好きです',
  '今日も一曲ずつ更新',
  '旧曲のメダルを集めています',
  'クリアメダル埋め優先',
  '주말에만 플레이합니다',
  '',
];

const SEED_USERS = [
  {
    id: '3120-8845-0217',
    name: 'みみ',
    comment: '좋아하는 곡을 천천히 플레이하며 메달을 모으고 있어요',
    popnClass: 19111,
    bestLevels: { 'clear': 50, 'full-combo': 50, 'perfect': 50 },
  },
  {
    id: '2459-4102-3156',
    name: 'くぴゃ',
    comment: '「スコアよりクリアメダル優先」',
    popnClass: 17800,
    bestLevels: { 'clear': 50, 'full-combo': 49, 'perfect': 48 },
  },
  {
    id: '0573-1188-4420',
    name: 'ポパー',
    comment: '고레벨 채보를 중심으로 매일 기록을 갱신하고 새로운 목표를 하나씩 달성해 나가고 있습니다',
    popnClass: 17491,
    bestLevels: { 'clear': 50, 'full-combo': 48, 'perfect': 48 },
  },
  {
    id: '6604-2731-9085',
    name: 'ニャミ',
    comment: '好きな曲を好きなだけ',
    popnClass: 17138,
    bestLevels: { 'clear': 49, 'full-combo': 48, 'perfect': 46 },
  },
  {
    id: '1287-5540-6613',
    name: 'おんがく',
    comment: '98kを目標にスコア詰め中',
    popnClass: 16975,
    bestLevels: { 'clear': 50, 'full-combo': 48, 'perfect': 47 },
  },
  {
    id: '9042-3317-7758',
    name: 'うさねこ',
    comment: '階段譜面が好きです',
    popnClass: 16720,
    bestLevels: { 'clear': 49, 'full-combo': 48, 'perfect': 45 },
  },
  {
    id: '4415-9028-1394',
    name: 'ぽっぷん',
    comment: '今日も一曲ずつ更新',
    popnClass: 16584,
    bestLevels: { 'clear': 49, 'full-combo': 47, 'perfect': 46 },
  },
  {
    id: '7738-6650-2201',
    name: 'サニパ',
    comment: '旧曲のメダルを集めています',
    popnClass: 16356,
    bestLevels: { 'clear': 45, 'full-combo': 30, 'perfect': null },
  },
];

const users = createUsers();

export function getUsers(searchParams) {
  const query = parseUsersQuery(searchParams);
  let filtered = users;

  if (query.search) {
    const search = query.search.toLocaleLowerCase();
    filtered = filtered.filter(user =>
      user.name.toLocaleLowerCase().includes(search)
      || user.id.includes(search));
  }

  const compare = comparatorFor(query.sort);
  const sorted = [...filtered].sort((left, right) => {
    const difference = compare(left, right);
    if (difference !== 0) {
      return query.order === 'asc' ? -difference : difference;
    }
    return left.id.localeCompare(right.id);
  });

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

function comparatorFor(sort) {
  if (sort === 'name') {
    return (left, right) => right.name.localeCompare(left.name, 'ja');
  }

  if (sort === 'clearLevel') {
    return (left, right) => clearLevelOf(right) - clearLevelOf(left);
  }

  if (sort === 'updatedAt') {
    return (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  }

  return (left, right) => right.rank - left.rank;
}

function clearLevelOf(user) {
  return user.bestLevels.find(level => level.kind === 'clear')?.maxLevel ?? -1;
}

function createUsers() {
  const random = mulberry32(0x55534552);
  const created = SEED_USERS.map(user => ({ ...user }));

  for (let index = created.length; index < TOTAL_USERS; index += 1) {
    created.push(createUser(random));
  }

  return created
    .sort((left, right) => right.popnClass - left.popnClass || left.id.localeCompare(right.id))
    .map((user, index) => ({
      id: user.id,
      name: user.name,
      avatarUrl: null,
      comment: user.comment,
      rank: index + 1,
      popnClass: user.popnClass,
      bestLevels: [
        { kind: 'clear', maxLevel: user.bestLevels.clear },
        { kind: 'full-combo', maxLevel: user.bestLevels['full-combo'] },
        { kind: 'perfect', maxLevel: user.bestLevels.perfect },
      ],
      updatedAt: updatedAtFor(index, random),
    }));
}

function createUser(random) {
  const popnClass = Math.round(3000 + random() * 13200);
  const clear = clamp(Math.round(popnClass / 400 + random() * 6), 1, 50);
  const fullCombo = clear <= 4 ? null : clamp(clear - 1 - Math.floor(random() * 6), 1, 50);
  const perfect = fullCombo === null || fullCombo <= 6
    ? null
    : clamp(fullCombo - Math.floor(random() * 8), 1, 50);

  return {
    id: createId(random),
    name: createName(random),
    comment: COMMENTS[Math.floor(random() * COMMENTS.length)],
    popnClass,
    bestLevels: { 'clear': clear, 'full-combo': fullCombo, 'perfect': perfect },
  };
}

function createName(random) {
  const length = NAME_LENGTH.min + Math.floor(random() * (NAME_LENGTH.max - NAME_LENGTH.min + 1));

  return Array.from(
    { length },
    () => NAME_CHARACTERS[Math.floor(random() * NAME_CHARACTERS.length)],
  ).join('');
}

function createId(random) {
  return Array.from({ length: 3 }, () =>
    String(Math.floor(random() * 10000)).padStart(4, '0')).join('-');
}

function updatedAtFor(index, random) {
  const offset = index < 8 ? index : Math.floor(random() * 720) + index % 7;

  return new Date(LATEST_UPDATED_AT - offset * DAY_IN_MILLISECONDS).toISOString();
}

function parseUsersQuery(searchParams) {
  const search = searchParams.get('q') ?? '';
  const sort = searchParams.get('sort') ?? 'rank';
  const order = searchParams.get('order') ?? 'asc';
  const page = parsePositiveInteger(searchParams, 'page', 1);
  const size = parsePositiveInteger(searchParams, 'size', 20);

  if (!SORT_KEYS.includes(sort)) {
    throw new InvalidUsersQueryError(`Invalid sort: ${sort}`);
  }

  if (order !== 'asc' && order !== 'desc') {
    throw new InvalidUsersQueryError(`Invalid order: ${order}`);
  }

  if (!PAGE_SIZES.includes(size)) {
    throw new InvalidUsersQueryError(`Invalid size: ${size}`);
  }

  if (search.length > 50) {
    throw new InvalidUsersQueryError(`Invalid q: ${search}`);
  }

  return { search, sort, order, page, size };
}

function parsePositiveInteger(searchParams, key, fallback) {
  const raw = searchParams.get(key);
  if (raw === null || raw === '') {
    return fallback;
  }

  if (!/^\d+$/.test(raw)) {
    throw new InvalidUsersQueryError(`Invalid ${key}: ${raw}`);
  }

  const value = Number(raw);
  if (value < 1) {
    throw new InvalidUsersQueryError(`Invalid ${key}: ${value}`);
  }

  return value;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
