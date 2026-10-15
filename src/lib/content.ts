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
