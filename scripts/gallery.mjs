/** Build the static README specimen sheet used for docs screenshots. */

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
  entryPoints: ['scripts/gallery.entry.js'],
  outfile: 'docs/gallery.js',
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome120'],
  charset: 'utf8',
  legalComments: 'none',
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    __RG_VERSION__: JSON.stringify(pkg.version),
  },
});

await writeFile(path.join(docs, 'gallery.html'), `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Retro Dock · specimen sheet</title>
<style>html,body{margin:0}</style>
</head>
<body>
<div id="root"></div>
<script src="./gallery.js"></script>
</body>
</html>
`);

console.log('gallery written to docs/gallery.html');
