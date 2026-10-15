// YouTube IFrame API wrapper: speed, mirror, A-B loop, wake lock, practice-time logging.
import { addPracticeSeconds } from './progress';

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  setPlaybackRate(rate: number): void;
  getAvailablePlaybackRates(): number[];
  getPlayerState(): number;
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | undefined;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => reject(new Error('YouTube API failed to load'));
    document.head.appendChild(s);
  });
  return apiPromise;
}

const fmt = (t: number) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export async function initPlayer(root: HTMLElement): Promise<void> {
  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const stage = q('[data-stage]');
  const mount = q('[data-mount]');
  const message = q('[data-message]');
  const abLabel = q('[data-ab-label]');
  const playBtn = q<HTMLButtonElement>('[data-act="play"]');
  const loopBtn = q<HTMLButtonElement>('[data-act="loop"]');
  const mirrorBtn = q<HTMLButtonElement>('[data-act="mirror"]');
  const speedBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-speed]')];
  const picker = root.querySelectorAll<HTMLButtonElement>('[data-video]');
  const controls = q('[data-controls]');
  const theaterBtn = q<HTMLButtonElement>('[data-act="theater"]');

  let a: number | null = null;
  let b: number | null = null;
  let looping = false;
  let timer: number | undefined;
  let wakeLock: { release(): Promise<void> } | null = null;

  // Practice time: seconds the video is actually playing, saved locally every few seconds.
  const track = root.dataset.track !== '0';
  let practiceStart: number | null = null;
  let practiceTimer: number | undefined;
  function flushPractice() {
    if (practiceStart === null) return;
    const now = Date.now();
    addPracticeSeconds((now - practiceStart) / 1000);
    practiceStart = now;
  }
  function startPractice() {
    if (!track || practiceStart !== null) return;
    practiceStart = Date.now();
    practiceTimer = window.setInterval(flushPractice, 5000);
  }
  function stopPractice() {
    flushPractice();
    practiceStart = null;
    if (practiceTimer !== undefined) window.clearInterval(practiceTimer);
    practiceTimer = undefined;
  }
  window.addEventListener('pagehide', flushPractice);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPractice();
  });

  let YT: YTNamespace;
  try {
    YT = await loadYouTubeApi();
  } catch {
    showMessage('The video player could not load. Check your connection and reload.');
    return;
  }

  function showMessage(text: string, href?: string) {
    message.hidden = false;
    message.textContent = text + ' ';
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open on YouTube';
      message.appendChild(link);
    }
  }

  // The fixed bottom bar (portrait phones) must not cover the end of the page.
  const barMode = window.matchMedia('(max-width: 720px) and (orientation: portrait)');
  const syncBar = () => {
    const h = Math.ceil(controls.getBoundingClientRect().height);
    root.style.setProperty('--bar-h', `${h}px`);
    const fixedBar = barMode.matches && !root.classList.contains('theater');
    document.body.style.paddingBottom = fixedBar ? `${h + 16}px` : '';
  };
  new ResizeObserver(syncBar).observe(controls);
  barMode.addEventListener('change', syncBar);
  syncBar();

  function setTheater(on: boolean) {
    root.classList.toggle('theater', on);
    theaterBtn.setAttribute('aria-pressed', String(on));
    theaterBtn.textContent = on ? 'Exit' : 'Theater';
    document.documentElement.style.overflow = on ? 'hidden' : '';
    syncBar();
    if (on) root.requestFullscreen?.().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && root.classList.contains('theater')) setTheater(false);
  });

  const first = root.dataset.firstId!;
  const firstStart = Number(root.dataset.firstStart ?? 0);

  const player = new YT.Player(mount, {
    videoId: first,
    host: 'https://www.youtube-nocookie.com',
    playerVars: { start: firstStart, rel: 0, playsinline: 1, modestbranding: 1 },
    events: {
      onStateChange: (e: { data: number }) => {
        const playing = e.data === YT.PlayerState.PLAYING;
        playBtn.textContent = playing ? 'Pause' : 'Play';
        playBtn.setAttribute('aria-pressed', String(playing));
        if (playing) {
          startTimer();
          startPractice();
          acquireWakeLock();
        } else {
          stopTimer();
          stopPractice();
          releaseWakeLock();
        }
      },
      onError: () => {
        showMessage('This video cannot be played here.', `https://www.youtube.com/watch?v=${currentId}`);
      },
    },
  });
  let currentId = first;

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => {
      if (looping && a !== null && b !== null && player.getCurrentTime() >= b) {
        player.seekTo(a, true);
      }
    }, 100);
  }
  function stopTimer() {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  }

  async function acquireWakeLock() {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request(t: 'screen'): Promise<{ release(): Promise<void> }> } };
      if (nav.wakeLock && !wakeLock) wakeLock = await nav.wakeLock.request('screen');
    } catch {
      /* unsupported or denied: ignore */
    }
  }
  function releaseWakeLock() {
    wakeLock?.release().catch(() => {});
    wakeLock = null;
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && player.getPlayerState?.() === YT.PlayerState.PLAYING) acquireWakeLock();
  });

  function updateAb() {
    const parts = [a === null ? 'A –' : `A ${fmt(a)}`, b === null ? 'B –' : `B ${fmt(b)}`];
    abLabel.textContent = parts.join('   ');
    loopBtn.disabled = a === null || b === null;
    if (loopBtn.disabled) {
      looping = false;
      loopBtn.setAttribute('aria-pressed', 'false');
    }
  }
  updateAb();

  root.addEventListener('click', (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-act],[data-speed],[data-video]');
    if (!el || !root.contains(el)) return;

    if (el.dataset.speed) {
      player.setPlaybackRate(Number(el.dataset.speed));
      speedBtns.forEach((s) => s.setAttribute('aria-pressed', String(s === el)));
      return;
    }
    if (el.dataset.video) {
      currentId = el.dataset.video;
      message.hidden = true;
      a = b = null;
      updateAb();
      player.loadVideoById({ videoId: currentId, startSeconds: Number(el.dataset.start ?? 0) });
      picker.forEach((p) => p.setAttribute('aria-pressed', String(p === el)));
      return;
    }
    switch (el.dataset.act) {
      case 'play':
        player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
        break;
      case 'back':
        player.seekTo(Math.max(0, player.getCurrentTime() - 5), true);
        break;
      case 'fwd':
        player.seekTo(player.getCurrentTime() + 5, true);
        break;
      case 'set-a':
        a = player.getCurrentTime();
        if (b !== null && b <= a) b = null;
        updateAb();
        break;
      case 'set-b': {
        const t = player.getCurrentTime();
        if (a === null || t <= a) break;
        b = t;
        updateAb();
        break;
      }
      case 'loop':
        looping = !looping;
        loopBtn.setAttribute('aria-pressed', String(looping));
        if (looping && a !== null) player.seekTo(a, true);
        break;
      case 'clear':
        a = b = null;
        updateAb();
        break;
      case 'theater':
        setTheater(!root.classList.contains('theater'));
        break;
      case 'mirror': {
        const on = stage.classList.toggle('mirrored');
        mirrorBtn.setAttribute('aria-pressed', String(on));
        break;
      }
    }
  });

  root.addEventListener('keydown', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('input, textarea, select')) return;
    const key = ev.key.toLowerCase();
    if (key === 'escape' && root.classList.contains('theater')) setTheater(false);
    else if (key === 't') theaterBtn.click();
    else if (key === 'm') (mirrorBtn as HTMLButtonElement).click();
    else if (key === 'l' && !loopBtn.disabled) loopBtn.click();
    else if (key === 'arrowleft') q<HTMLButtonElement>('[data-act="back"]').click();
    else if (key === 'arrowright') q<HTMLButtonElement>('[data-act="fwd"]').click();
    else if (['1', '2', '3', '4'].includes(key)) speedBtns[Number(key) - 1]?.click();
    else return;
    ev.preventDefault();
  });
}
