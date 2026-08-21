import { resolveBanner } from './banners.mjs';
import {
  LEGACY_TARGETS,
  LEVEL_STATS,
  NEW_SONGS,
  OLD_SONGS,
  PROGRESS_BY_DIFFICULTY,
  PROGRESS_BY_LEVEL,
  RECORDS,
  RENEWAL_RESULT,
  SESSION,
  SESSION_COOKIE,
  USER_PROFILE,
} from './fixtures.mjs';
import { readJson, sendJson } from './http.mjs';
import { getUsers, InvalidUsersQueryError } from './users.mjs';

export const routes = [
  { method: 'GET', pattern: /^\/api\/v1\/auth\/session$/, handle: handleSession },
  { method: 'GET', pattern: /^\/api\/v1\/users$/, handle: handleUsers },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)\/popn-class-targets\/(current|legacy)$/, handle: handleTargets },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)\/level-stats$/, handle: handleLevelStats },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)\/records$/, handle: handleRecords },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)\/progress$/, handle: handleProgress },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)$/, handle: handleProfile },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/login$/, handle: handleLogin },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/logout$/, handle: handleLogout },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/register$/, handle: handleRegister },
  { method: 'POST', pattern: /^\/api\/v1\/renewals$/, handle: handleRenewal },
];

function handleSession(request, response) {
  sendJson(response, 200, {
    code: 'SUCCESS',
    data: request.headers.cookie?.includes(`${SESSION_COOKIE}=1`) ? SESSION : null,
    message: 'The request is successful.',
  });
}

function handleUsers(request, response) {
  const origin = `http://${request.headers.host ?? 'localhost'}`;
  const params = new URL(request.url ?? '/', origin).searchParams;

  try {
    const data = getUsers(params);
    sendJson(response, 200, { code: 'SUCCESS', data, message: 'The request is successful.' });
  }
  catch (error) {
    if (error instanceof InvalidUsersQueryError) {
      sendJson(response, 400, { code: 'BAD_REQUEST', data: null, message: '요청 형식이 올바르지 않습니다.' });
      return;
    }
    throw error;
  }
}

function handleTargets(request, response, params) {
  const [, calculation] = params;
  const origin = `http://${request.headers.host ?? 'localhost'}`;

  sendJson(response, 200, {
    code: 'SUCCESS',
    data: calculation === 'current'
      ? {
          newSongs: NEW_SONGS.map(song => resolveBanner(song, origin)),
          oldSongs: OLD_SONGS.map(song => resolveBanner(song, origin)),
        }
      : LEGACY_TARGETS.map(song => resolveBanner(song, origin)),
    message: 'The request is successful.',
  });
}

function handleLevelStats(request, response) {
  sendJson(response, 200, {
    code: 'SUCCESS',
    data: LEVEL_STATS,
    message: 'The request is successful.',
  });
}

function handleProgress(request, response) {
  const origin = `http://${request.headers.host ?? 'localhost'}`;
  const params = new URL(request.url ?? '/', origin).searchParams;
  const data = params.get('by') === 'difficulty' ? PROGRESS_BY_DIFFICULTY : PROGRESS_BY_LEVEL;

  sendJson(response, 200, {
    code: 'SUCCESS',
    data,
    message: 'The request is successful.',
  });
}

function handleRecords(request, response) {
  const origin = `http://${request.headers.host ?? 'localhost'}`;
  const params = new URL(request.url ?? '/', origin).searchParams;

  const query = params.get('q')?.trim().toLowerCase();
  const version = toInt(params.get('version'));
  const levelMin = toInt(params.get('levelMin'));
  const levelMax = toInt(params.get('levelMax'));
  const scoreMin = toInt(params.get('scoreMin'));
  const scoreMax = toInt(params.get('scoreMax'));
  const difficulty = toCodeSet(params.get('difficulty'));
  const medal = toCodeSet(params.get('medal'));
  const rank = toCodeSet(params.get('rank'));
  const sortKey = params.get('sort') === 'score' ? 'score' : 'level';
  const order = params.get('order') === 'asc' ? 'asc' : 'desc';
  const page = Math.max(toInt(params.get('page')) ?? 1, 1);
  const size = toInt(params.get('size')) ?? 20;

  const filtered = RECORDS.filter((record) => {
    if (query && !record.title.toLowerCase().includes(query) && !record.genre.toLowerCase().includes(query))
      return false;
    if (version !== undefined && record.version !== version)
      return false;
    if (levelMin !== undefined && record.level < levelMin)
      return false;
    if (levelMax !== undefined && record.level > levelMax)
      return false;
    if (scoreMin !== undefined && record.score < scoreMin)
      return false;
    if (scoreMax !== undefined && record.score > scoreMax)
      return false;
    if (difficulty && !difficulty.has(record.difficulty))
      return false;
    if (medal && !medal.has(record.medal))
      return false;
    if (rank && !rank.has(record.rank))
      return false;
    return true;
  });

  const direction = order === 'asc' ? 1 : -1;
  const sorted = [...filtered].sort((left, right) => {
    const diff = (left[sortKey] - right[sortKey]) * direction;
    return diff !== 0 ? diff : left.id.localeCompare(right.id);
  });

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / size);
  const start = (page - 1) * size;
  const items = sorted.slice(start, start + size).map(record => resolveBanner(record, origin));

  sendJson(response, 200, {
    code: 'SUCCESS',
    data: {
      items,
      totalItems,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
    message: 'The request is successful.',
  });
}

function toInt(value) {
  if (value === null || value === '')
    return undefined;

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function toCodeSet(value) {
  if (!value)
    return undefined;

  const codes = value.split(',').map(Number).filter(Number.isInteger);
  return codes.length > 0 ? new Set(codes) : undefined;
}

function handleProfile(request, response, params) {
  const [userId] = params;

  if (userId === '0000-0000-0404') {
    sendJson(response, 404, { code: 'NOT_FOUND', data: null, message: `${userId} 유저를 찾을 수 없습니다.` });
    return;
  }

  if (userId === '0000-0000-0403') {
    sendJson(response, 403, { code: 'FORBIDDEN', data: null, message: '이 프로필을 볼 권한이 없습니다.' });
    return;
  }

  sendJson(response, 200, { code: 'SUCCESS', data: USER_PROFILE, message: 'The request is successful.' });
}

async function handleLogin(request, response) {
  try {
    await readJson(request);
    response.setHeader('Set-Cookie', `${SESSION_COOKIE}=1; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`);
    sendJson(response, 200, { code: 'SUCCESS', data: null, message: 'The request is successful.' });
  }
  catch {
    sendJson(response, 400, { code: 'BAD_REQUEST', data: null, message: '요청 형식이 올바르지 않습니다.' });
  }
}

function handleLogout(request, response) {
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
  sendJson(response, 200, { code: 'SUCCESS', data: null, message: 'The request is successful.' });
}

async function handleRegister(request, response) {
  try {
    await readJson(request);
    response.setHeader('Set-Cookie', `${SESSION_COOKIE}=1; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`);
    sendJson(response, 200, { code: 'SUCCESS', data: SESSION, message: 'The request is successful.' });
  }
  catch {
    sendJson(response, 400, { code: 'BAD_REQUEST', data: null, message: '요청 형식이 올바르지 않습니다.' });
  }
}

async function handleRenewal(request, response) {
  try {
    await readJson(request);
    sendJson(response, 200, { code: 'SUCCESS', data: RENEWAL_RESULT, message: 'The request is successful.' });
  }
  catch {
    sendJson(response, 400, { code: 'BAD_REQUEST', data: null, message: '요청 형식이 올바르지 않습니다.' });
  }
}
