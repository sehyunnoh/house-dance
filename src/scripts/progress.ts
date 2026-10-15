const KEY = 'hd:learned';

export function learnedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function setLearned(slug: string, on: boolean): void {
  const set = learnedSet();
  if (on) set.add(slug);
  else set.delete(slug);
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* storage unavailable: progress is not persisted */
  }
}
