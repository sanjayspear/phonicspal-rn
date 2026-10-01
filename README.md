# PhonicsPal (React Native + Expo)

Cross-platform rebuild of [PhonicsPal](../phonicspal) (iOS, Android, Web) as a TypeScript monorepo.
Full spec: [`docs/DESIGN.md`](docs/DESIGN.md).

## Layout

```
apps/
  app/            # Expo app (expo-router) — targets iOS, Android, and Web from one codebase
packages/
  core/           # domain types (roles, phonics topics, Learning Path model)
  ui/             # shared design tokens/components
  speech/         # SpeechEngine interface, platform-specific TTS adapters
  api/            # typed backend client (Learning Path sync)
```

## Getting started

```bash
npm install
npm run app          # expo start
npm run app:web       # web
npm run app:ios       # iOS simulator
npm run app:android   # Android emulator
```

## Status

Scaffold only — see `docs/DESIGN.md` §5 "Open items" for what's still undecided
(backend project, monorepo build tool, content migration plan).
