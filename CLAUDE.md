# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PhonicsPal (React Native + Expo rebuild): a cross-platform (iOS/Android/Web) rebuild of the original [PhonicsPal](https://github.com/sanjayspear/PhonicPal) static-site app, as a TypeScript npm-workspaces monorepo. The full product/architecture spec this was scaffolded from lives in `docs/DESIGN.md` — read it before making structural decisions (data models, screen list, backend choices) rather than guessing; this file only covers how to work in the repo day to day.

**Status:** scaffold only. `apps/app` is a stock Expo template wired into the workspace; the actual PhonicsPal features (phonics topics, reader, books, vocab, auth/roles, Learning Path homework pipeline) have not been ported/built yet. See `docs/DESIGN.md` §5 "Open items" for what's undecided before real feature work starts (Firebase project, monorepo build tool, content migration plan).

## Commands

Run everything from the repo root (npm workspaces) — do not `cd` into `apps/app` and run `npm install` there, it will create a nested lockfile/`node_modules` that breaks hoisting.

- `npm install` — installs and links all workspaces (`apps/*`, `packages/*`).
- `npm run app` — `expo start` (pick platform interactively).
- `npm run app:web` — run in a browser.
- `npm run app:ios` / `npm run app:android` — simulator/emulator.
- No lint/typecheck/test script is wired at the root yet. Typecheck a single package directly, e.g. `npx tsc -p packages/core --noEmit`.

## Monorepo layout

```
apps/
  app/            # the only app target — Expo + expo-router, universal (iOS/Android/Web from one codebase)
packages/
  core/           # domain types: Role, PhonicsTopic, LearningPath/LearningPathNode (docs/DESIGN.md §4.1)
  ui/             # shared design tokens (docs/DESIGN.md §2.2) — components not yet built
  speech/         # SpeechEngine interface (docs/DESIGN.md §3.3) — no platform implementations yet
  api/            # typed backend client interface (docs/DESIGN.md §4.4) — unimplemented, no Firebase wiring yet
```

`packages/*` are referenced from `apps/app/package.json` as `"@phonicspal/<name>": "*"` — these resolve via npm workspace symlinks (`node_modules/@phonicspal/* -> packages/*`), not the registry. There is nothing to publish; don't version-bump them for releases.

## Architecture notes carried over from v1 (apply here too)

- **Voice/speech is the core complexity.** v1's Kokoro/Piper WASM engines are web-only and do not port to native — native TTS goes through `expo-speech` instead. `packages/speech`'s `SpeechEngine` interface exists so call sites don't care which backend is active; don't call a platform TTS API directly from a screen component.
- **Pre-rendered phonics audio ports as-is** — v1's `assets/audio/*.mp3` files are reused unchanged (bundled for native, static-served for web), not resynthesized.
- **Roles are first-class** (`teacher` / `parent` / `solo`, see `packages/core/src/types.ts`), same three roles as v1 — they now drive which dashboard a user lands on, not just a feature gate.
- **Real-time sync is new in this rebuild** — v1 had no backend sync at all. The Learning Path homework pipeline (`packages/api`) is the one feature with no v1 equivalent; see `docs/DESIGN.md` §4 before implementing it, since the sync model (Firestore `onSnapshot`, security rules scoped by role) is load-bearing to get right the first time.

## When adding a new package

Follow the existing `packages/*` shape: a `package.json` named `@phonicspal/<name>`, a `tsconfig.json` extending `../../tsconfig.base.json`, source under `src/`, and add it to the consuming app's `package.json` as `"@phonicspal/<name>": "*"` — then re-run `npm install` from the root.
