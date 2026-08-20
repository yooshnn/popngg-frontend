import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BANNER_DIRECTORY = fileURLToPath(new URL('./assets/banners/', import.meta.url));

export function resolveBanner(song, origin) {
  return { ...song, bannerUrl: song.bannerUrl.replace('{{origin}}', origin) };
}

export async function sendBanner(response, fileName) {
  if (!/^[\w.-]+\.png$/.test(fileName)) {
    response.writeHead(400, { 'Content-Type': 'text/plain' }).end('invalid banner name');
    return;
  }

  try {
    const file = await readFile(join(BANNER_DIRECTORY, fileName));
    response.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
    response.end(file);
  }
  catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('banner not found');
  }
}
