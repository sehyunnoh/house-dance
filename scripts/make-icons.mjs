// Generates the favicon and PWA icons: a dancing figure in a jack pose over a beat ring, on the dark club background.
// Usage: npm run icons
import fs from 'node:fs';
import sharp from 'sharp';

const out = new URL('../public/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
fs.mkdirSync(`${out}icons`, { recursive: true });

// `pad` shrinks the artwork for maskable icons (safe zone); `round` rounds the background for the browser tab icon.
const svg = ({ pad = 0, round = 0 } = {}) => {
  const s = 512;
  const c = s / 2;
  const k = 1 - pad * 2;
  const limb = 'fill="none" stroke="url(#body)" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="46%" r="55%">
      <stop offset="0" stop-color="#FF2E93" stop-opacity=".5"/>
      <stop offset="1" stop-color="#FF2E93" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FF2E93"/>
      <stop offset="1" stop-color="#FFB02E"/>
    </linearGradient>
  </defs>
  <rect width="${s}" height="${s}" rx="${round}" fill="#0B0A12"/>
  <g transform="translate(${c} ${c}) scale(${k}) translate(${-c} ${-c})">
    <circle cx="${c}" cy="236" r="232" fill="url(#glow)"/>
    <ellipse cx="${c}" cy="452" rx="196" ry="30" fill="none" stroke="#2EE6D6" stroke-width="16" opacity=".95"/>
    <circle cx="276" cy="112" r="46" fill="url(#body)"/>
    <path ${limb} d="M262 188 L246 318"/>
    <path ${limb} d="M262 196 L172 238 L118 152"/>
    <path ${limb} d="M262 196 L350 226 L410 150"/>
    <path ${limb} d="M246 318 L168 384 L120 438"/>
    <path ${limb} d="M246 318 L330 352 L392 424"/>
  </g>
</svg>`;
};

fs.writeFileSync(`${out}favicon.svg`, svg({ round: 112 }));
const png = (name, size, opts) => sharp(Buffer.from(svg(opts))).resize(size, size).png().toFile(`${out}icons/${name}`);
await Promise.all([
  png('icon-192.png', 192, {}),
  png('icon-512.png', 512, {}),
  png('icon-maskable-512.png', 512, { pad: 0.12 }),
  png('apple-touch-icon.png', 180, {}),
]);
console.log('icons written');
