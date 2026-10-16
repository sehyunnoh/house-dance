// All user data lives in this browser's localStorage. Nothing is sent anywhere.
const KEYS = {
  learned: 'hd:learned',
  graduated: 'hd:graduated',
  log: 'hd:log',
  combos: 'hd:combos',
  favs: 'hd:favs',
  recent: 'hd:recent',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: data is not persisted */
  }
}

// ---- Learned steps ----
export function learnedSet(): Set<string> {
  return new Set(read<string[]>(KEYS.learned, []));
}

export function setLearned(slug: string, on: boolean): void {
  const set = learnedSet();
  if (on) set.add(slug);
  else set.delete(slug);
  write(KEYS.learned, [...set]);
}

// ---- Practice list (favorites) and recently viewed ----
export function favList(): string[] {
  return read<string[]>(KEYS.favs, []);
}

export function setFav(slug: string, on: boolean): void {
  const list = favList().filter((s) => s !== slug);
  if (on) list.push(slug);
  write(KEYS.favs, list);
}

export function recentList(): string[] {
  return read<string[]>(KEYS.recent, []);
}

export function pushRecent(slug: string): void {
  write(KEYS.recent, [slug, ...recentList().filter((s) => s !== slug)].slice(0, 8));
}

// ---- Graduation checks ----
export function graduatedSet(): Set<number> {
  return new Set(read<number[]>(KEYS.graduated, []));
}

export function setGraduated(level: number, on: boolean): void {
  const set = graduatedSet();
  if (on) set.add(level);
  else set.delete(level);
  write(KEYS.graduated, [...set]);
}

// ---- Practice log (seconds of video playing, per local day) ----
export const STREAK_MIN_SECONDS = 60;

export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function practiceLog(): Record<string, number> {
  return read<Record<string, number>>(KEYS.log, {});
}

export function addPracticeSeconds(seconds: number): void {
  if (!(seconds > 0)) return;
  const log = practiceLog();
  const k = dayKey();
  log[k] = Math.round(((log[k] ?? 0) + seconds) * 10) / 10;
  write(KEYS.log, log);
}

/** Consecutive days with enough practice. Today may still be empty without breaking the streak. */
export function currentStreak(log = practiceLog()): number {
  const d = new Date();
  if ((log[dayKey(d)] ?? 0) < STREAK_MIN_SECONDS) d.setDate(d.getDate() - 1);
  let n = 0;
  while ((log[dayKey(d)] ?? 0) >= STREAK_MIN_SECONDS) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function longestStreak(log = practiceLog()): number {
  const days = Object.keys(log)
    .filter((k) => log[k] >= STREAK_MIN_SECONDS)
    .sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of days) {
    const [y, m, d] = k.split('-').map(Number);
    const cur = new Date(y, m - 1, d);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86_400_000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}

export function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ---- Combos ----
export interface ComboItem {
  slug: string;
  counts: number;
}
export interface Combo {
  id: string;
  name: string;
  bpm: number;
  items: ComboItem[];
}

export function loadCombos(): Combo[] {
  return read<Combo[]>(KEYS.combos, []);
}

export function saveCombos(combos: Combo[]): void {
  write(KEYS.combos, combos);
}

// ---- Backup ----
export function exportData(): string {
  return JSON.stringify(
    {
      app: 'house-dance',
      version: 1,
      learned: [...learnedSet()],
      graduated: [...graduatedSet()],
      log: practiceLog(),
      combos: loadCombos(),
      favs: favList(),
      recent: recentList(),
    },
    null,
    2,
  );
}

export function importData(text: string): boolean {
  try {
    const d = JSON.parse(text);
    if (d?.app !== 'house-dance') return false;
    if (Array.isArray(d.learned)) write(KEYS.learned, d.learned.filter((x: unknown) => typeof x === 'string'));
    if (Array.isArray(d.graduated)) write(KEYS.graduated, d.graduated.filter((x: unknown) => Number.isInteger(x)));
    if (d.log && typeof d.log === 'object') write(KEYS.log, d.log);
    if (Array.isArray(d.combos)) write(KEYS.combos, d.combos);
    if (Array.isArray(d.favs)) write(KEYS.favs, d.favs.filter((x: unknown) => typeof x === 'string'));
    if (Array.isArray(d.recent)) write(KEYS.recent, d.recent.filter((x: unknown) => typeof x === 'string'));
    return true;
  } catch {
    return false;
  }
}

export function resetData(): void {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
