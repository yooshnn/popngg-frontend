import { resolveBanner } from './banners.mjs';
import {
  LEGACY_TARGETS,
  LEVEL_STATS,
  NEW_SONGS,
  OLD_SONGS,
  SESSION,
  SESSION_COOKIE,
  USER_PROFILE,
} from './fixtures.mjs';
import { readJson, sendJson } from './http.mjs';

export const routes = [
  { method: 'GET', pattern: /^\/api\/v1\/ping$/, handle: handlePing },
  { method: 'GET', pattern: /^\/api\/v1\/pong$/, handle: handlePong },
  { method: 'GET', pattern: /^\/api\/v1\/auth\/session$/, handle: handleSession },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)\/popn-class-targets\/(current|legacy)$/, handle: handleTargets },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)\/level-stats$/, handle: handleLevelStats },
  { method: 'GET', pattern: /^\/api\/v1\/users\/([^/]+)$/, handle: handleProfile },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/login$/, handle: handleLogin },
  { method: 'POST', pattern: /^\/api\/v1\/auth\/logout$/, handle: handleLogout },
];

function handlePing(request, response) {
  sendJson(response, 200, {
    code: 'SUCCESS',
    data: { message: 'pong', receivedCookie: Boolean(request.headers.cookie) },
    message: 'The request is successful.',
  });
}

function handlePong(request, response) {
  sendJson(response, 200, {
    code: 'SUCCESS',
    data: { message: 'ping', receivedCookie: Boolean(request.headers.cookie) },
    message: 'The request is successful.',
  });
}

function handleSession(request, response) {
  sendJson(response, 200, {
    code: 'SUCCESS',
    data: request.headers.cookie?.includes(`${SESSION_COOKIE}=1`) ? SESSION : null,
    message: 'The request is successful.',
  });
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
