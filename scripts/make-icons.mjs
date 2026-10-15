// Generates the favicon and PWA icons: a magenta "beat" dot with pulse rings on the dark club background.
// Usage: node scripts/make-icons.mjs
import fs from 'node:fs';
import sharp from 'sharp';

const out = new URL('../public/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
fs.mkdirSync(`${out}icons`, { recursive: true });

// `pad` shrinks the artwork for maskable icons, which need a safe zone.
const svg = (pad = 0) => {
  const s = 512;
  const c = s / 2;
  const k = 1 - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#FF2E93" stop-opacity=".55"/>
      <stop offset="1" stop-color="#FF2E93" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="#0B0A12"/>
  <g transform="translate(${c} ${c}) scale(${k}) translate(${-c} ${-c})">
    <circle cx="${c}" cy="${c}" r="230" fill="url(#g)"/>
    <circle cx="${c}" cy="${c}" r="200" fill="none" stroke="#2EE6D6" stroke-width="14" opacity=".9"/>
    <circle cx="${c}" cy="${c}" r="150" fill="none" stroke="#FFB02E" stroke-width="14" opacity=".9"/>
    <circle cx="${c}" cy="${c}" r="92" fill="#FF2E93"/>
  </g>
</svg>`;
};

fs.writeFileSync(`${out}favicon.svg`, svg(0));
const png = (name, size, pad) => sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(`${out}icons/${name}`);
await Promise.all([
  png('icon-192.png', 192, 0),
  png('icon-512.png', 512, 0),
  png('icon-maskable-512.png', 512, 0.12),
  png('apple-touch-icon.png', 180, 0),
]);
console.log('icons written');
