import { createServer } from 'node:http';
import process from 'node:process';

const port = Number(process.env.MOCK_API_PORT ?? 3001);

const server = createServer((request, response) => {
  const origin = request.headers.origin ?? 'http://localhost:5173';

  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
