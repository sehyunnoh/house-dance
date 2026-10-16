// Shared helpers for the home and progress pages: next step to learn, and chip lists of steps.
export interface StepInfo {
  slug: string;
  title: string;
  level: number;
  color: string;
  href: string;
  pre: string[];
}

/** First unlearned step whose prerequisites are all learned; falls back to the first unlearned step. */
export function nextUp(steps: StepInfo[], learned: Set<string>): StepInfo | null {
  return (
    steps.find((s) => !learned.has(s.slug) && s.pre.every((p) => learned.has(p))) ??
    steps.find((s) => !learned.has(s.slug)) ??
    null
  );
}

/** Fills a <ul> with links to steps. Pass onRemove to add a remove button to each row. */
export function renderStepList(
  ul: HTMLElement,
  slugs: string[],
  bySlug: Map<string, StepInfo>,
  onRemove?: (slug: string) => void,
): void {
  ul.textContent = '';
  for (const slug of slugs) {
    const s = bySlug.get(slug);
    if (!s) continue;
    const li = document.createElement('li');
    li.style.setProperty('--lv', s.color);
    const a = document.createElement('a');
    a.href = s.href;
    const lv = document.createElement('span');
    lv.className = 'lv';
    lv.setAttribute('aria-hidden', 'true');
    lv.textContent = String(s.level);
    const name = document.createElement('span');
    name.textContent = s.title;
    a.append(lv, name);
    li.append(a);
    if (onRemove) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rm';
      b.textContent = 'Remove';
      b.setAttribute('aria-label', `Remove ${s.title} from the list`);
      b.addEventListener('click', () => onRemove(slug));
      li.append(b);
    }
    ul.append(li);
  }
}
