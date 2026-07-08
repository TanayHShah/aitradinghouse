import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC = join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    }

    const filePath = normalize(join(PUBLIC, pathname));
    if (!filePath.startsWith(PUBLIC)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    let target = filePath;
    if (!existsSync(target)) {
      const withHtml = `${filePath}.html`;
      if (existsSync(withHtml)) {
        target = withHtml;
      } else {
        target = join(PUBLIC, '404.html');
        if (!existsSync(target)) {
          res.writeHead(404).end('Not found');
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(await readFile(target));
        return;
      }
    }

    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[extname(target)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch (err) {
    console.error(err);
    res.writeHead(500).end('Server error');
  }
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use.\n` +
        `Free it with:  kill $(lsof -t -iTCP:${PORT} -sTCP:LISTEN)\n` +
        `Or start on another port:  PORT=3011 npm start`
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Trading House frontend on http://0.0.0.0:${PORT}`);
});
