import { createServer } from 'node:http';
import process from 'node:process';
import { sendBanner } from './banners.mjs';
import { sendJson } from './http.mjs';
import { routes } from './routes.mjs';

const port = Number(process.env.MOCK_API_PORT ?? 3001);

const server = createServer(async (request, response) => {
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

  if (request.method === 'GET' && url.pathname.startsWith('/assets/banners/')) {
    await sendBanner(response, url.pathname.slice('/assets/banners/'.length));
    return;
  }

  for (const route of routes) {
    if (route.method !== request.method) {
      continue;
    }

    const match = url.pathname.match(route.pattern);

    if (match) {
      await route.handle(request, response, match.slice(1));
      return;
    }
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
