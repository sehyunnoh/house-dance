import type { APIRoute } from 'astro';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'House Dance Practice',
      short_name: 'House Practice',
      description: 'Learn house dance step by step, from foundations to floor work.',
      id: `${base}/`,
      start_url: `${base}/`,
      scope: `${base}/`,
      display: 'standalone',
      orientation: 'any',
      background_color: '#0B0A12',
      theme_color: '#0B0A12',
      icons: [
        { src: `${base}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${base}/icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
        { src: `${base}/icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
