import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
// Marketing routes exist once in English.
const MARKETING_ROUTES = [
  '/',
  '/products/',
  '/products/item-a765/',
  '/services/',
  '/blog/',
  '/blog/post-1/',
  '/insights/insight-1/',
];
const ROUTES = [...MARKETING_ROUTES, '/404'];

// Cheap content assertions on top of the status check.
const EXPECTATIONS = {
  '/': ['<html lang="en"', 'Contact Us', 'aria-current="page"'],
  '/products/': ['aria-current="page"'],
  '/services/': ['aria-current="page"'],
  '/blog/': ['aria-current="page"'],
  '/blog/post-1/': ['"@type":"BlogPosting"'],
};

const FORBIDDEN = [
  'hreflang=',
  'hs-toggle-between-modals',
  'Change language',
  'Log in',
  'Sign in',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
};

function resolvePath(urlPath) {
  let pathname = decodeURIComponent(urlPath.split('?')[0]);
  if (pathname.includes('\0') || /(?:^|[/\\])\.\.(?:[/\\]|$)/.test(pathname)) {
    throw Object.assign(new Error('Invalid path'), { code: 'EINVAL' });
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  else if (!extname(pathname)) pathname += '/index.html';
  if (pathname === '/404/index.html') pathname = '/404.html';

  const filePath = resolve(DIST, pathname.replace(/^[/\\]+/, ''));
  const rel = relative(DIST, filePath);
  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw Object.assign(new Error('Path escapes dist'), { code: 'EACCES' });
  }
  return filePath;
}

async function run() {
  const server = createServer(async (req, res) => {
    try {
      const filePath = resolvePath(req.url || '/');
      const data = await readFile(filePath);
      const type = MIME[extname(filePath)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    } catch {
      try {
        const data = await readFile(resolve(DIST, '404.html'));
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  let failed = false;
  try {
    for (const route of ROUTES) {
      const res = await fetch(`${base}${route}`);
      const ok = route === '/404' ? res.status === 404 || res.ok : res.ok;
      if (!ok) {
        console.error(`FAIL ${route} → ${res.status}`);
        failed = true;
        continue;
      }
      const html = await res.text();
      const missing = (EXPECTATIONS[route] ?? []).filter(
        needle => !html.includes(needle)
      );
      const forbidden = FORBIDDEN.filter(needle => html.includes(needle));
      const activeLinkCount = (html.match(/aria-current="page"/g) ?? []).length;
      if (missing.length) {
        console.error(`FAIL ${route} → missing ${missing.join(', ')}`);
        failed = true;
      } else if (forbidden.length) {
        console.error(`FAIL ${route} → forbidden ${forbidden.join(', ')}`);
        failed = true;
      } else if (MARKETING_ROUTES.includes(route) && activeLinkCount !== 1) {
        console.error(`FAIL ${route} → expected 1 active link, got ${activeLinkCount}`);
        failed = true;
      } else {
        console.log(`OK   ${route} → ${res.status}`);
      }
    }
  } finally {
    server.close();
  }

  if (failed) process.exit(1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
