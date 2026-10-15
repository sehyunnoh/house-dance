# House Dance Practice Site — Development Plan (v2)

## 1. Goal
A responsive website for learning house dance by following videos, with a **structured level-by-level curriculum** covering the whole house vocabulary. It must work well on phones (propped up in front of a mirror), tablets, and desktops.

Core idea: **"Pick a step, play the video slow, mirror it, loop the hard part."**

## 2. Decisions (changed from v1)
| Topic | Decision |
|---|---|
| Framework | **Astro** (static output, content collections, minimal JS) |
| Hosting | **GitHub Pages**, deployed via GitHub Actions |
| Language | **English only** |
| Motivation | New **Get Inspired** menu with popular, curated house dance videos linked back to the curriculum |
| Content | Researched house-dance vocabulary, organized into levels and a progression path |
| Video source | YouTube embeds only (no self-hosting) |

## 3. Research Summary

### 3.1 What house dance is
- Freestyle social dance from the underground house scenes of **Chicago** and **New York** (early 1980s: Warehouse, Music Box, Paradise Garage, Red Zone, NYC loft parties).
- Three core elements:
  1. **Jacking** — a rippling, bouncing movement of the torso; the signature of early Chicago house.
  2. **Footwork** — fast, complex steps that follow the rhythms and riffs of the track. Influences: African dance, Jamaican skanking (heel-toe), tap, Caribbean rhythms, capoeira.
  3. **Lofting** — the floor-oriented style from NYC loft parties: spins, slides, go-downs.
- Regional flavors: Chicago/Detroit lean harder and jack-heavy; New York absorbed more hip-hop and codified Loose Legs, Train, Skate; West Coast leans commercial/b-boy. Hip-hop imports include Criss Cross, Roger Rabbit, and the Skate.
- Terminology varies by teacher and region, so the site treats step names and groupings as a **community-standard approximation**, not a rulebook.

### 3.2 Sources used
- [Wikipedia — House dance](https://en.wikipedia.org/wiki/House_dance)
- [FraGue — House move list (43 moves, with origins and credited teachers)](https://www.frague.at/house-move-list/)
- [Will Bamberg — House dance moves (grouped by family)](https://www.willbamberg.com/garden/house-dance-moves/)
- [5 Magazine — Spin, Slide and Jack: A History of House Dancing](https://5mag.net/features/house-dance-and-dancing/)
- [Wikipedia — Jacking (dance)](https://en.wikipedia.org/wiki/Jacking_(dance))
- Alvin Ailey class descriptions (core steps: jacking, skating, chase, salsa hop, sidewalk, stomp, shuffle)

### 3.3 Research caveats (to resolve during content work)
- The sources mostly give **names and groupings**, with few written explanations. Step descriptions on the site will be written by us and **must be checked against a tutorial video** before publishing.
- Level placement below is **our teaching-order judgment** based on step dependencies (e.g., Pas de Bourrée before its variations), not an official standard.
- A few names are ambiguous or have aliases (e.g., Shuffle/Dodger, Roger Rabbit/Reject, Lotus/Marjory, Scribble Foot/Triplet Step). Aliases are stored per step.

## 4. Curriculum — Levels and Steps

Each level has a **goal**, a **step list in recommended order**, and a **graduation check** (a short combo to prove readiness). Steps are listed in the order they should be practiced.

### Level 0 — Foundations (feel the music)
Goal: find the beat, bounce, and stay relaxed.
1. Counting 4/4 and the 120–128 BPM house tempo
2. The Bounce (down-bounce on every beat, knees soft)
3. Groove / Feel (free movement to the kick drum)
4. Weight shifts (side to side, front to back)
5. **Jack** — front jack, back jack, side jack

Graduation: 32 counts of bounce + jack, staying on beat.

### Level 1 — Beginner (the core six)
Goal: the classic steps every house dancer knows.
1. Jack in the Box
2. Stomp / Stomping
3. Farmer (jack + stomp)
4. Shuffle (feet angled out) and Dodger (feet parallel)
5. Sidewalk
6. Salsa Step
7. Heel Toe (basic)
8. Skate (side to side)

Graduation: 4 × 8 counts chaining Jack → Farmer → Shuffle → Sidewalk → Salsa Step.

### Level 2 — Elementary (build the footwork base)
Goal: pas de bourrée family, lateral movement, cleaner rhythm.
1. Pas de Bourrée (plus drag front/behind, heel drops)
2. Crosswalk
3. Cross Step
4. Crossroads
5. Scribble Foot (a.k.a. Triplet Step)
6. Salsa Hop
7. Retreat
8. Gallop
9. The Set Up
10. Heel Drops and Toe Drops
11. Pivot Step (tap and kick-out variations)
12. Quick Step
13. Jogs

Graduation: 8-count phrase with Pas de Bourrée → Crosswalk → Salsa Hop → Gallop.

### Level 3 — Intermediate (signature moves)
Goal: the steps that give house its recognizable look.
1. Loose Legs (forward, sideways, jump-in variations)
2. Chase
3. Train (heel-toe + skating)
4. Can Opener
5. Skating (traveling; squat/duck-walk variation)
6. Swirl
7. Lotus
8. Heel Toe Hop
9. Gallop Shuffle and Gallop Shuffle Cross
10. Criss Cross (hip-hop origin)
11. Roger Rabbit / Reject (hip-hop origin)
12. Jack Jumps
13. Snake
14. Tip Tap Toe
15. Triangle and Diamond
16. Reverse Jogs
17. Pivoting Pas de Bourrée
18. Charleston Train Tracks

Graduation: 16-count combo mixing a Loose Legs section, a Skate/Train section, and a Pas de Bourrée section.

### Level 4 — Advanced (flow, turns, and style)
Goal: turning, speed, direction changes, and personal style.
1. Spins and turns: Barrel Turn, Cross Turn, Hook Turn, Reverse Step Turn, Pivot Spin
2. Scissors
3. Player
4. Peter Paul
5. African Step
6. Pow Wow
7. Around the World
8. Camel Walk
9. Heel Touch and Slopes
10. Party Machine / Spongebob
11. Happy Feet
12. Spiderman Style
13. Speed and direction-change drills
14. Musicality: accents, breaks, and building phrases

Graduation: a 32-count freestyle combo with at least two direction changes and one turn.

### Level 5 — Lofting and Floor Work
Goal: go to the floor and come back smoothly.
1. Knee Drop / Pin Drop
2. Floor Spin
3. Ground Sweep
4. Russian Kick
5. Corkscrew
6. Dolphin Dive (variations: jumping, handspring half and full turn)
7. Lofty
8. Transitions: standing → floor → standing
9. Freestyle and cypher etiquette

Graduation: 1-minute freestyle with at least one floor transition.

> Total: 75 named steps across 6 levels. The final list will be trimmed to steps that have a good tutorial video.

## 5. Content Model (Astro Content Collections)

Each step is one Markdown file in `src/content/steps/`, validated with a Zod schema.

```yaml
---
title: "Loose Legs"
slug: loose-legs
level: 3            # 0–5
order: 1            # order within the level
family: "chase-loose-leg"
aliases: []
origin: "house"     # house | hip-hop | other
prerequisites: ["pas-de-bourree", "heel-toe"]
bpm: [120, 126]
videos:
  - id: "<youtube-id>"   # verified embeddable only
    title: "Loose legs breakdown"
    start: 0
    kind: "tutorial"     # tutorial | slow | demo | inspiration
cues:
  - "Keep your center steady; the legs swing loosely from the hips"
verified: false     # set true after checking against a video
---
Short written description and common mistakes.
```

Inspiration videos live in `src/content/inspire/*.md` (or one YAML per video) with their own schema:

```yaml
---
title: "<video title>"
youtubeId: "<verified embeddable id>"
category: "battle"      # popular | legends | battle | performance | social
dancer: "<name or crew>"
event: "<event name, optional>"
year: 2019
views: 1200000          # recorded value
statsAsOf: 2026-10-15
steps: ["jack", "loose-legs", "skate"]   # must match existing step slugs
featured: false         # eligible for the home-page "Daily inspiration" tile
blurb: "One line on why it is worth watching"
---
```

Build-time validation fails if `steps` references a slug that does not exist.

Also: `src/content/levels/` (level title, goal, graduation check) and a `families` data file for grouping (Jack, Pas de Bourrée, Heel/Toe, Skating, Chase & Loose Leg, Go-downs, Spins).

## 6. Features

### MVP
| Feature | Description |
|---|---|
| Curriculum path | Home page shows Levels 0–5 as a clear progression; each level lists its steps in order |
| Step page | Video player, written cues, prerequisites, "next step" link |
| Player controls | Speed 0.25× / 0.5× / 0.75× / 1×, A-B loop, mirror (flip) mode |
| Progress tracking | Mark steps as "learned" (saved in `localStorage`), level progress bars |
| Search and filter | By level, family, origin |
| Responsive layout | Mobile-first, thumb-reachable control bar |
| Wake Lock | Keep the screen on while practicing |

### Get Inspired (new menu)
A top-level **"Get Inspired"** page for motivation: popular, high-energy house dance videos to watch before or between practice sessions.

| Aspect | Plan |
|---|---|
| Content | Curated, not user-submitted: battle finals, cypher highlights, performances, classic footage, social-dance clips |
| Sections | **Most Popular** (ranked by view count), **Legends and History** (Chicago/NYC roots), **Battles and Cyphers**, **Performances**, **Social Dance / Club** |
| Card | Thumbnail, title, dancer/event, year, view count with "as of" date, and a "Steps you'll recognize" list linking to curriculum pages |
| Filters | Category (above), era, level of the steps featured |
| Player | Same embed player, but with speed and mirror controls hidden by default (this is for watching, not drilling); a "Practice these steps" button jumps to the matching step pages |
| Home integration | A "Daily inspiration" tile on the home page showing one random video; a level-complete screen suggests an inspiring video featuring that level's steps |
| Loop back to learning | Each video lists tagged steps (e.g., `jack`, `loose-legs`), so a viewer can go from "wow" to "how" in one tap |

Popularity handling:
- View counts are recorded **at curation time** in the data file with a `statsAsOf` date (no API key or runtime calls needed, keeps the site fully static).
- Optional later upgrade: a build-time script using the YouTube Data API (key stored as a GitHub Actions secret) to refresh counts on each deploy.
- Ranking in "Most Popular" is by recorded views, but a human picks the shortlist, so quality and relevance beat raw numbers.

### Phase 2
- "Practice queue" (favorites) and recent history
- Practice log (minutes per day, streak)
- Keyboard shortcuts (Space, ←/→ ±5s, 1–4 speed, M mirror, L loop)
- Beat counter / metronome (120–128 BPM)
- PWA install and offline shell
- Combo builder: chain learned steps into an 8/16/32-count routine

### Out of scope
- Accounts, backend, database, self-hosted video

## 7. Design Direction: "Underground Warehouse Club"
- **Mood:** dark warehouse party; warm lights and neon accents, rhythmic and bold.
- **Colors:** background `#0B0A12`; hot magenta `#FF2E93`; amber `#FFB02E`; cyan `#2EE6D6`. Each level gets an accent color so progression feels visible.
- **Type:** Anton or Bebas Neue for headings, Inter for body.
- **Texture:** subtle grain overlay and soft glow; no heavy gradients.
- **Motion:** gentle beat-pulse on the logo and level badges, card hover glow; fully disabled under `prefers-reduced-motion`.
- **Layout:**
  - Mobile: single column, sticky bottom control bar, video pinned to top on step pages.
  - Desktop: video left, steps list and notes right.
- **Accessibility:** contrast ≥ 4.5:1, 44px minimum touch targets, visible focus states.

## 8. Technical Architecture

```
house-dance/
├─ PLAN.md
├─ astro.config.mjs          # site + base for GitHub Pages
├─ package.json
├─ public/                   # favicon, og image, grain texture
├─ src/
│  ├─ content.config.ts      # collections + Zod schemas
│  ├─ content/
│  │  ├─ steps/*.md
│  │  ├─ levels/*.md
│  │  └─ inspire/*.md
│  ├─ layouts/Base.astro
│  ├─ components/
│  │  ├─ LevelCard.astro
│  │  ├─ StepCard.astro
│  │  ├─ ProgressBar.astro
│  │  └─ Player.astro        # client script: YouTube IFrame API wrapper
│  ├─ pages/
│  │  ├─ index.astro         # curriculum overview
│  │  ├─ levels/[level].astro
│  │  ├─ steps/[...slug].astro
│  │  ├─ inspire/index.astro      # Get Inspired listing
│  │  ├─ inspire/[slug].astro     # single video + linked steps
│  │  └─ progress.astro
│  ├─ scripts/               # player.ts, progress.ts, wakelock.ts
│  └─ styles/                # tokens.css, global.css
└─ .github/workflows/deploy.yml
```

Key technical points:
- **Static output.** Pages are generated at build time from content collections; JavaScript ships only for the player, progress tracking, and filters (Astro islands / small client scripts).
- **A-B loop:** poll `getCurrentTime()` roughly every 100 ms; when it reaches B, call `seekTo(A)`.
- **Speed:** `setPlaybackRate()` using only YouTube-supported rates.
- **Mirror mode:** `transform: scaleX(-1)` on the video wrapper only; controls stay un-flipped.
- **Progress:** `localStorage`, wrapped in try/catch with a graceful fallback.
- **Build-time checks:** schema validation fails the build if a step has a bad level, a missing prerequisite slug, or a malformed video entry.

### GitHub Pages deployment
- `astro.config.mjs`: set `site: 'https://<username>.github.io'` and `base: '/<repo-name>'` (omit `base` if the repo is named `<username>.github.io`).
- All internal links and asset paths must respect `base` (use `import.meta.env.BASE_URL`).
- Add `.github/workflows/deploy.yml` using `withastro/action` and `actions/deploy-pages` (trigger on push to `main`, plus manual dispatch).
- Commit the lockfile (the action detects the package manager from it).
- In the repo: **Settings → Pages → Source: GitHub Actions**.

## 9. Development Phases

| Phase | Work | Done when |
|---|---|---|
| 1. Setup | Astro project, TypeScript, tokens, base layout, deploy workflow | Empty site builds and deploys to GitHub Pages |
| 2. Content model | Collection schemas; create all level files and step stubs from Section 4 | Build passes; all 75 steps exist as stubs |
| 3. Curriculum UI | Home path, level pages, step cards, filters | Navigable on mobile and desktop |
| 4. Player | Embed, speed, mirror, A-B loop | Controls work on real video |
| 5. Video curation | Find and verify one or more tutorial videos per step; fill cues; set `verified: true` | Every Level 0–3 step has a working video first, then Levels 4–5 |
| 5b. Get Inspired | Curate 20–30 popular and iconic videos, verify embeds, tag steps; build listing, detail page, and home tile | Menu works; every video plays and links to valid steps |
| 6. Progress | Learned checkmarks, level progress, graduation checklist | State persists across reloads |
| 7. Mobile polish | Bottom control bar, landscape mode, Wake Lock | One-handed use on a real phone |
| 8. Phase 2 features | Practice log, shortcuts, metronome, PWA | As prioritized |
| 9. QA and launch | Accessibility, Lighthouse, link/video checks | Mobile Lighthouse ≥ 90, no console errors |

## 10. Verification
- Screenshots at 390 px, 768 px, and 1280 px widths via browser automation.
- Zero console errors; build succeeds on a clean checkout.
- Manually exercise speed, mirror, and loop on a real video.
- Check that deployed links work under the `base` path (the most common GitHub Pages bug).
- Script that checks every video ID for embeddability and flags dead ones.

## 11. Risks
| Risk | Mitigation |
|---|---|
| Wrong or inconsistent step names/levels | Mark `verified` per step; show an "unverified" badge until checked; keep aliases |
| Videos removed or embedding disabled | Error handling with a link to the original video; periodic link-check script |
| Broken links/assets on GitHub Pages | Always use `BASE_URL`; test the production build locally with `astro preview` |
| iOS Safari inline playback limits | Use `playsinline`; test on a real iPhone |
| Copyright | Embed only; credit the creator and link to the source |
| Inspiration video choice and stale view counts | Human-curated shortlist; show "as of" date; link-check script covers these videos too |
| Scope creep (75 steps) | Ship Levels 0–3 first, then add 4–5 |

## 12. Decisions Made and Open Questions

**Decided**
- GitHub user: `sehyunnoh`; repository: `house-dance` (public, required for free GitHub Pages).
- Astro config: `site: 'https://sehyunnoh.github.io'`, `base: '/house-dance'`. Live URL: https://sehyunnoh.github.io/house-dance/
- Level 5 (Lofting and Floor Work) is **included**.

**Still open (handled during the relevant phase)**
1. Specific dancers, battles, or events to feature in Get Inspired (otherwise a researched shortlist is shown for approval first).
2. Static view counts (default) vs. build-time refresh via the YouTube Data API.

## 13. Progress Log

| Phase | Status |
|---|---|
| 1. Setup and deploy | Done |
| 2. Content model (75 steps, 6 levels) | Done |
| 3. Curriculum UI | Done |
| 4. Player (speed, mirror, A-B loop, wake lock) | Done |
| 5. Video curation | In progress: 40 of 75 steps have verified-embeddable tutorials (second search pass done) |
| 5b. Get Inspired | Done for v1: 17 videos, 4 categories plus Most Popular, daily tile on home |
| 6. Progress tracking | Done (learned checkbox, level progress bars); graduation checklist still open |
| 7-9 | Not started |

Notes on curated content:
- Every video id was checked against YouTube oEmbed (embeddable) and its title and channel were read back. Videos were **not watched in full**, so step text stays `verified: false`.
- Inspire entries have `steps: []` for now. Tag steps only after watching, so tags are accurate.
- Inspire view counts are static as of 2026-10-15. Player controls (speed, mirror, loop) are also shown on inspiration videos, which is useful for studying battles in slow motion.
- Steps still without a video (35): around-the-world, barrel-turn, camel-walk, can-opener, charleston-train-tracks, cross-turn, diamond, floor-spin, gallop-shuffle-cross, gallop-shuffle, ground-sweep, happy-feet, heel-drops, heel-toe-hop, heel-touch, hook-turn, jack-jumps, jogs, lofty, musicality, pivoting-pas-de-bourree, player, quick-step, reverse-jogs, reverse-step-turn, salsa-hop, set-up, skating, slopes, snake, speed-and-direction-drills, spiderman-style, toe-drops, triangle, weight-shifts.
- Several of these have no house-specific tutorial on YouTube (hook turn, cross turn, spiderman style, player, floor spin, ground sweep, lofty). Options: find a teacher channel, record notes from the 100/200-steps reference videos, or leave them as reference-only steps.
- Run `npm run check:videos` before deploys to confirm every referenced video is still embeddable.
- Some attached videos are from neighboring styles and are labeled as such in the video title (breaking, hip-hop).
