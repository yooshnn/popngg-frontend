import { createServer } from 'node:http';

const PORT = 3001;
const PREFIX = '/api/v1';
const ACCESS_TOKEN = 'access_token';
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

const MOCK_USER = { id: 'u_1', name: 'くぴゃ' };
const LOGGED_OUT = { user: null, role: null };

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Routes are keyed by `METHOD PATH` and return `{ status, headers, data, message }`,
 * all optional. Envelope assembly stays in one place, below.
 */
const routes = {
  [`GET ${PREFIX}/ping`]: async (req) => {
    await sleep(200);

    return {
      data: { message: 'pong 🏓', cookie: req.headers.cookie ?? null },
    };
  },

  [`GET ${PREFIX}/pong`]: async (req) => {
    await sleep(200);

    return {
      data: { message: 'ping 🏓', cookie: req.headers.cookie ?? null },
    };
  },

  [`GET ${PREFIX}/auth/session`]: req => ({
    data: getCookie(req, ACCESS_TOKEN)
      ? { user: MOCK_USER, role: 'USER' }
      : LOGGED_OUT,
  }),

  [`POST ${PREFIX}/auth/login`]: async (req) => {
    const body = await readBody(req);

    if (body.password === 'wrong') {
      return {
        status: 401,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    return {
      headers: {
        'set-cookie': `${ACCESS_TOKEN}=mock; HttpOnly; SameSite=Lax; Path=/; Max-Age=${WEEK_IN_SECONDS}`,
      },
      data: { user: MOCK_USER, role: 'USER' },
    };
  },

  [`POST ${PREFIX}/auth/logout`]: () => ({
    headers: {
      'set-cookie': `${ACCESS_TOKEN}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    },
    data: null,
  }),
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', `http://localhost:${PORT}`).pathname;
  const headers = {
    'content-type': 'application/json',
    'access-control-allow-origin': req.headers.origin ?? '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'content-type, cookie',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const route = routes[`${req.method} ${path}`];
  if (!route) {
    res.writeHead(404, headers);
    res.end(
      JSON.stringify({
        data: null,
        message: `no mock for ${req.method} ${path}`,
      }),
    );
    return;
  }

  const {
    status = 200,
    headers: extra,
    data = null,
    message,
  } = await route(req);

  res.writeHead(status, { ...headers, ...extra });
  res.end(JSON.stringify(message ? { data, message } : { data }));
});

server.listen(PORT, () => {
  console.log(`mock api listening on http://localhost:${PORT}${PREFIX}`);
});

// Utils

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }
  return raw ? JSON.parse(raw) : {};
}

function getCookie(req, name) {
  return (
    req.headers.cookie
      ?.split(';')
      .map(pair => pair.trim().split('='))
      .find(([key]) => key === name)?.[1] ?? null
  );
}
