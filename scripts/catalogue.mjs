/** Build the standalone seven-instrument catalogue. */

import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = path.join(root, 'docs');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
await mkdir(docs, { recursive: true });

await build({
  absWorkingDir: root,
  entryPoints: ['scripts/catalogue.entry.jsx'],
  outfile: 'docs/catalogue.js',
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome120'],
  charset: 'utf8',
  legalComments: 'none',
  minify: true,
  jsx: 'transform',
  define: {
    'process.env.NODE_ENV': '"production"',
    __RG_VERSION__: JSON.stringify(pkg.version),
  },
});

await writeFile(path.join(docs, 'catalogue.html'), `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Retro Dock · 七种测量语言</title>
<style>html,body{margin:0}</style>
</head>
<body>
<div id="root"></div>
<script src="./catalogue.js"></script>
</body>
</html>
`);

console.log('catalogue written to docs/catalogue.html');
