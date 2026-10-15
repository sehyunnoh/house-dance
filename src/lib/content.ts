import { getCollection } from 'astro:content';

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;

export const familyLabel = (family: string) =>
  family
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

/** Loads all levels with their steps sorted in practice order, and validates prerequisites. */
export async function loadCurriculum() {
  const [levelEntries, stepEntries] = await Promise.all([getCollection('levels'), getCollection('steps')]);
  const slugs = new Set(stepEntries.map((s) => s.id));
  for (const s of stepEntries) {
    for (const p of s.data.prerequisites) {
      if (!slugs.has(p)) throw new Error(`Step "${s.id}" has unknown prerequisite "${p}"`);
    }
  }
  const levels = levelEntries
    .sort((a, b) => a.data.level - b.data.level)
    .map((l) => ({
      ...l.data,
      steps: stepEntries.filter((s) => s.data.level === l.data.level).sort((a, b) => a.data.order - b.data.order),
    }));
  const bySlug = new Map(stepEntries.map((s) => [s.id, s]));
  return { levels, steps: stepEntries, bySlug };
}

export const categoryLabel: Record<string, string> = {
  legends: 'Legends and History',
  battle: 'Battles and Cyphers',
  performance: 'Performances',
  social: 'Social Dance and Club',
};

export const formatViews = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${Math.round(n / 1_000)}K` : String(n);

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Loads inspiration videos, most viewed first, and checks that tagged steps exist. */
export async function loadInspire() {
  const [items, stepEntries] = await Promise.all([getCollection('inspire'), getCollection('steps')]);
  const slugs = new Set(stepEntries.map((s) => s.id));
  for (const i of items) {
    for (const s of i.data.steps) {
      if (!slugs.has(s)) throw new Error(`Inspire "${i.id}" tags unknown step "${s}"`);
    }
  }
  return items.sort((a, b) => b.data.views - a.data.views);
}
