# PhonicsPal — Cross-Platform Redesign & Architecture Document

**Status:** Design reference for a future rebuild. Not implemented against the current repo.
**Source app:** PhonicsPal v1 (plain HTML/CSS/JS, no build step, no framework) — see `CLAUDE.md` for its current architecture.
**Purpose of this document:** a self-contained spec to hand to an implementation session later, to scaffold a new repository for a React Native + Expo rebuild of PhonicsPal.

---

## 0. Baseline: what v1 actually has today

Before redesigning, this is the real feature surface being carried forward (so the new app is a port + upgrade, not a guess):

- **Auth & roles** (`js/auth.js`): sign-up/log-in, local or Firebase provider, three roles — `teacher` / `parent` / `solo` — chosen at sign-up and stored per-uid.
- **Phonics** (`js/topics.js`, `js/phonics.js`, `js/phonics-views.js`, `js/phonics-game.js`): 62 topics across 8 groups (sounds, blending, digraphs, r-controlled vowels, diphthongs, word families, magic e, stories), each with pre-rendered audio, a "for grown-ups" guide, a 5-round game, and a stars/stickers reward system.
- **Reader** (`js/reader.js`): TTS reading with word highlighting, pause/resume/stop.
- **Books** (`js/books.js`): PDF/TXT/EPUB upload (35MB cap), text extraction, IndexedDB library.
- **Dictionary & vocabulary** (`js/dictionary.js`, `js/vocabulary.js`): word lookup, save-word, practice quiz.
- **Persistence today:** everything client-side — `localStorage` for roles/prefs/custom cards, IndexedDB for books, Firebase Auth only (no app-data sync).

The redesign's job is to keep this feature set, fix the UX problems below, and add the one genuinely new capability v1 doesn't have: **teacher ↔ parent homework assignment with real-time progress sync**, which requires a real backend for the first time.

---

## 1. App Interface & Feature Breakdown

Screens are organized per role, since role already exists as a first-class concept in v1's auth system — this redesign surfaces it in the navigation instead of only in a stored flag.

### 1.1 Registration / Onboarding
- **Sign-up flow:** email/password or Google, then role selection (`teacher` / `parent` / `solo`) — same three roles as v1, now driving which dashboard the app routes to post-login instead of just gating features.
- **Teacher-specific step:** class/roster creation (name a class, generate a join code).
- **Parent-specific step:** join a class via teacher's code (optional — a parent can also run standalone, same as `solo` in v1), plus add one or more child profiles (name, age, avatar — no PII beyond first name).
- **Technical parameters:** email format + password strength validated client-side before submit; join-code validated server-side (exists, not expired); role is immutable after creation (changing roles means a new account, matching v1's existing constraint).

### 1.2 Role Dashboard
- **Teacher Dashboard:** roster list → per-student progress summary (topics completed, stars earned, last-active) → "Learning Paths" tab to build/assign paths → a live activity feed of recent submissions (the real-time piece, see §4).
- **Parent Dashboard:** one card per child → current assigned Learning Path with progress bar → quick links into Phonics/Read/Books/Vocab for free-play (non-assigned use, same as v1's `solo` experience).
- **Solo Dashboard:** unchanged from v1's home screen — word-of-the-day, section grid (Phonics/Read/Books/Vocab/Help) — no path/roster UI at all.
- **Technical parameters:** dashboard data is fetched once on mount, then subscribed to (see §4.3) for live updates; stale-while-revalidate so the UI never blocks on network before showing cached state.

### 1.3 Learning Trackers
- **Per-topic tracker:** mirrors v1's existing stars/stickers system (`js/phonics-guide.js`) — surfaced here as a visual history instead of only an in-the-moment reward.
- **Per-child tracker (parent/teacher view):** topics attempted vs. mastered, game scores per round, reading minutes (from `reader.js` usage), vocabulary words saved/quizzed.
- **Technical parameters:** trackers read from the same event stream that drives progress sync (§4.3) — no separate "analytics" system to keep in sync by hand.

### 1.4 Settings
- **Account:** email/password change, log out, delete account (local data wipe + backend record delete).
- **Voice/engine:** carries over v1's `ENV.tier` / engine picker (browser / Piper / Kokoro) where the platform supports it — see §3.3 for what's actually portable.
- **Accessibility:** text size, high-contrast toggle, reduce-motion toggle — new in this redesign, informed by §2.
- **Role-specific:** teacher can regenerate class join code or remove a student; parent can switch between children's profiles; solo has none of the above.

---

## 2. Expert UX Audit & Friction Analysis

Acting as a senior UX reviewer of the current PhonicsPal interface, for a 4–5-year-old primary user with a parent/teacher as secondary operator:

### 2.1 Findings

1. **Unbounded viewport scaling.** Text/touch targets sized with raw `vw`/`vh` units or unclamped `rem` scale erratically between a phone and a tablet — a button that's comfortably tappable on a Pixel 8a can become tiny on a small phone or oversized on an iPad, which is especially bad for the target age group's motor control.
2. **Floating navigation elements.** Nav/action buttons positioned with `position: fixed`/`absolute` without a defined safe area can drift over content on devices with notches/gesture bars, and compete with on-screen keyboards during text entry (e.g. custom phonics card creation).
3. **Low label contrast.** Pastel-on-pastel kid-friendly color choices often fail WCAG AA contrast ratios — fine for decoration, a problem for anything a 4–5-year-old (or a low-vision parent) needs to actually read to act on.
4. **No clear container hierarchy.** Sections (home/phonics/read/books/vocab) are visually similar in weight, so a child has no spatial memory of "where things live" — everything reads as one undifferentiated scroll.
5. **Reward feedback is flat.** Stars/stickers appear without motion or sound layering, which undersells the dopamine hit that's the actual retention mechanism for this age group.

### 2.2 Recommendations

| Problem | Fix |
|---|---|
| Unbounded scaling | Use `clamp(min, preferred, max)` for all type and touch-target sizing; define a fixed set of breakpoints (phone / tablet / desktop) rather than fluid-only scaling. |
| Floating nav | Dock primary nav to a safe-area-aware bottom tab bar (mobile) / left rail (tablet+), using platform safe-area insets, never raw fixed positioning. |
| Low contrast | Establish a token-based palette with contrast-checked pairs (background/label) baked into the design system — see §3.2 — enforced at the component level, not per-screen. |
| Flat hierarchy | Each top-level section gets a distinct accent color + icon used consistently in its card, header, and nav icon, so color becomes a wayfinding cue. |
| Flat rewards | Add a short (<400ms) scale+confetti micro-interaction and a matching audio cue on star/sticker earn, reusing the existing pre-rendered-audio pipeline for the sound. |

These become concrete component requirements in the shared `packages/ui` design system (§3.1), not per-screen CSS tweaks — the whole point of the monorepo is that this fix happens once.

---

## 3. Cross-Platform Technical Blueprint

### 3.1 Why React Native + Expo + TypeScript monorepo

v1's constraint ("no build step, no framework") was right for a single static site, but it's exactly what breaks down once the product needs to run natively on iOS/Android with device APIs (offline TTS caching, file system access for the book library, push notifications for homework reminders) while *also* staying on the web. React Native + Expo is the standard answer to "one codebase, native + web" at this scale:

- **Expo Router** gives file-based routing that works identically on native and web, replacing v1's single-page `go(id)`/`hidden`-section model with real per-platform navigation (stack on mobile, same stack rendered as routes on web) without forking logic.
- **Expo's managed workflow + EAS Build** removes the native tooling overhead (no manual Xcode/Android Studio project maintenance) — relevant since this is a small team shipping a kids' app, not a native-mobile shop.
- **TypeScript monorepo** (Turborepo or Nx) lets business logic — curriculum data, game logic, progress calculation, the Learning Path data model — live in one `packages/core` consumed by every target, so a bug fix in "how a blending round is scored" is fixed once, not three times.

### 3.2 Monorepo layout

```
phonicspal-rn/
  apps/
    mobile/        # Expo app — iOS + Android
    web/           # Expo web export (static) — replaces v1's index.html
  packages/
    core/          # curriculum data (ported from topics.js/curriculum.js), scoring, Learning Path model
    ui/            # shared design-system components (tokens from §2.2, cross-platform via RN primitives)
    speech/        # TTS adapter interface (see 3.3)
    api/           # typed client for the backend (§4), used by both apps
  tsconfig.base.json
  package.json     # workspaces
```

### 3.3 Porting the hard part: voice/speech

This is v1's actual core complexity (`js/speech.js`, `ENV` tiering) and needs explicit, honest treatment rather than a hand-wave:

- **Pre-rendered audio** (`assets/audio/*.mp3`) ports directly — same files, bundled as static assets (mobile) / served statically (web export). No change needed.
- **Live synthesis fallback** does *not* port directly: v1's Kokoro/Piper WASM engines are web-only. On native, the equivalent is `expo-speech` (wraps platform TTS — AVSpeechSynthesizer / Android TextToSpeech) as the native "browser voice" equivalent. Kokoro/Piper-quality on-device synthesis is out of scope for a v1 port — ship native with `expo-speech` as the sole live-fallback engine, keep Kokoro/Piper only in the `apps/web` build where WASM still works.
- `packages/speech` defines one `SpeechEngine` interface; `apps/web` registers `{browser, piper, kokoro}` implementations, `apps/mobile` registers `{expoSpeech}` — call sites (`sp(text, rate, keep)` equivalent) stay platform-agnostic.

### 3.4 Porting storage

| v1 (web) | RN equivalent |
|---|---|
| `localStorage` (roles, prefs, custom cards) | `expo-sqlite` or `@react-native-async-storage/async-storage`, wrapped in the same `LS`-style helper so call sites don't change |
| IndexedDB (book library) | `expo-sqlite` for metadata + `expo-file-system` for the actual PDF/TXT/EPUB blobs |
| Firebase Auth | unchanged — `firebase/auth` (JS SDK) works across web and RN (with `@react-native-firebase/auth` as the native-optimized alternative if push notifications are added later) |

### 3.5 Deployment

- **Web:** `expo export --platform web` → static output deployable to GitHub Pages exactly like v1 today (keeps the existing "Deploying (cache-busting)" workflow conceptually alive, just with a build step now).
- **iOS/Android:** EAS Build → TestFlight / Play internal testing → store release.
- **Tablets:** no separate target — both apps already run on tablets via responsive layout (§2.2 breakpoints); this is a layout concern, not a platform concern.

---

## 4. Interactive Homework Pipeline (Role-Based Workflows)

This is the one piece with no v1 equivalent — it requires introducing a real backend (Firestore is the natural choice since Firebase Auth may already be configured per `auth.js`'s `FIREBASE_CONFIG`).

### 4.1 Data model

```ts
type LearningPathNode = {
  id: string;
  order: number;
  type: 'topic' | 'assignment';
  refId: string;        // topics.js topic id (e.g. "blend-cvc") when type === 'topic'
  status: 'locked' | 'available' | 'in_progress' | 'submitted' | 'reviewed';
  submittedAt?: string;
  childNote?: string;   // optional voice/text note recorded on submission
};

type LearningPath = {
  id: string;
  classId: string;
  studentId: string;
  createdBy: string;    // teacher uid
  nodes: LearningPathNode[];
  updatedAt: string;
};
```

Nodes form a **linear** path deliberately (per spec) — no branching logic needed for v1 of this feature; `order` is the sole sequencing field, which keeps both the teacher builder UI and the parent "what's next" UI trivial (just sort and find the first non-`submitted` node).

### 4.2 Teacher persona — Learning Path builder

- Drag-to-reorder list UI; each node is either "insert a Phonics Topic" (picker over `packages/core`'s topic list — same 62 topics/8 groups as v1) or "insert a standalone assignment" (free-text instructions + optional attachment).
- Publishing a path writes one `LearningPath` document per assigned student (fan-out on assign, not on read) so parent/teacher reads are always a single-document fetch.
- Teacher dashboard's activity feed subscribes to `onSnapshot` across all paths for their `classId`, ordered by `updatedAt desc`.

### 4.3 Parent persona — guided execution

- Parent app renders the child's current `LearningPath`, highlighting the first node whose status isn't `submitted` as "today's task."
- Tapping a `topic` node deep-links into the existing Phonics topic screen (reusing v1's topic view components from §3.2's `packages/ui` + `packages/core` port) in a "guided" mode that shows parent-facing tips (ported from `phonics-guide.js`'s grown-up guide).
- On completion, parent taps "Submit" → node status flips to `submitted`, `submittedAt` set, write goes straight to Firestore.

### 4.4 State synchronization

- **Mechanism:** Firestore `onSnapshot` listeners, not polling — both the parent's path view and the teacher's class activity feed subscribe directly to the relevant documents/collection query, so a parent's submission appears on the teacher's dashboard without a refresh (meets the "instantly" requirement in the spec).
- **Offline:** Firestore's built-in offline persistence covers the case where a parent completes an assignment without connectivity — the write queues locally and syncs on reconnect, appearing on the teacher side once that sync happens.
- **Security:** Firestore rules scope reads/writes by role — a parent can only write to `LearningPath` docs where `studentId` is one of their own children; a teacher can only write to paths where `classId` matches a class they created.

---

## 5. Open items for the implementation session

These are decisions deferred to whoever (future me) picks this up to build:

1. Confirm whether `FIREBASE_CONFIG` already has a live project (per v1's `auth.js`) to reuse, or whether this is a fresh Firebase project.
2. Decide Turborepo vs. Nx for the monorepo tool (either satisfies §3.2 — not a load-bearing choice).
3. Decide how much of v1's 62-topic content gets hand-ported into `packages/core` vs. regenerated — the audio assets (`assets/audio/*.mp3`) should be reusable as-is regardless.
4. New repository name and initial scaffold command (`npx create-expo-app` with the TS + router template, then convert to a workspace).
