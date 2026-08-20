export function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

export function readJson(request) {
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
