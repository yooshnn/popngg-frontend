import { createServer } from 'node:http';
import process from 'node:process';

const port = Number(process.env.MOCK_API_PORT ?? 3001);
const SESSION_COOKIE = 'popngg_mock_session';
const SESSION = {
  poptomoId: '2459-4102-3156',
  userName: 'popn.gg',
  avatarUrl: null,
};

const server = createServer((request, response) => {
  const origin = request.headers.origin ?? 'http://localhost:5173';

  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');

  if (request.method === 'OPTIONS') {
    response.writeHead(204).end();
    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/api/v1/ping') {
    sendJson(response, 200, {
      code: 'SUCCESS',
      data: {
        message: 'pong',
        receivedCookie: Boolean(request.headers.cookie),
      },
      message: 'The request is successful.',
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/pong') {
    sendJson(response, 200, {
      code: 'SUCCESS',
      data: {
        message: 'ping',
        receivedCookie: Boolean(request.headers.cookie),
      },
      message: 'The request is successful.',
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/auth/session') {
    sendJson(response, 200, {
      code: 'SUCCESS',
      data: request.headers.cookie?.includes(`${SESSION_COOKIE}=1`) ? SESSION : null,
      message: 'The request is successful.',
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/auth/login') {
    readJson(request).then(() => {
      response.setHeader('Set-Cookie', `${SESSION_COOKIE}=1; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`);
      sendJson(response, 200, {
        code: 'SUCCESS',
        data: null,
        message: 'The request is successful.',
      });
    }).catch(() => {
      sendJson(response, 400, {
        code: 'BAD_REQUEST',
        data: null,
        message: '요청 형식이 올바르지 않습니다.',
      });
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/auth/logout') {
    response.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
    sendJson(response, 200, {
      code: 'SUCCESS',
      data: null,
      message: 'The request is successful.',
    });
    return;
  }

  sendJson(response, 404, {
    code: 'NOT_FOUND',
    data: null,
    message: 'Not Found',
  });
});

server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});

server.listen(port, () => {
  process.stdout.write(`Mock API listening on http://localhost:${port}\n`);
});

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.setEncoding('utf8');
    request.on('data', chunk => body += chunk);
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      }
      catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}
