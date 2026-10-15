// Checks that every YouTube video referenced in src/content is still embeddable.
// Usage: npm run check:videos
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../src/content/', import.meta.url);
const files = [];
for (const dir of ['steps', 'inspire']) {
  const full = new URL(`${dir}/`, root);
  for (const name of fs.readdirSync(full)) files.push({ dir, name, path: path.join(full.pathname.replace(/^\/(\w:)/, '$1'), name) });
}

const idRe = /^\s*(?:- id|youtubeId|"id"):\s*"([^"]+)"/gm;
const refs = new Map();
for (const f of files) {
  const text = fs.readFileSync(f.path, 'utf8');
  for (const m of text.matchAll(idRe)) {
    if (!refs.has(m[1])) refs.set(m[1], []);
    refs.get(m[1]).push(`${f.dir}/${f.name}`);
  }
}

const refFile = new URL('../data/references.json', root);
for (const m of fs.readFileSync(refFile, 'utf8').matchAll(idRe)) {
  if (!refs.has(m[1])) refs.set(m[1], []);
  refs.get(m[1]).push('data/references.json');
}

const ids = [...refs.keys()];
const bad = [];
for (let i = 0; i < ids.length; i += 8) {
  await Promise.all(
    ids.slice(i, i + 8).map(async (id) => {
      try {
        const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (!r.ok) bad.push({ id, status: r.status, used: refs.get(id) });
      } catch (e) {
        bad.push({ id, status: e.message, used: refs.get(id) });
      }
    }),
  );
}

console.log(`Checked ${ids.length} videos.`);
if (bad.length) {
  console.error('Problems:');
  for (const b of bad) console.error(`  ${b.id} (${b.status}) used in ${b.used.join(', ')}`);
  process.exit(1);
}
console.log('All videos are embeddable.');
