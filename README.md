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
cd phonicspal-rn
npm install           # only needed once, or after pulling dependency changes
npm run app:web       # fastest way to preview — opens in your browser
```

`npm run app:web` boots Metro and should auto-open `http://localhost:8081`
(or similar — the terminal prints the exact URL if it doesn't). With no
session yet, it lands on the **Sign Up** screen: pick a role (Teacher /
Parent / Solo), enter any email + a 6+ character password, and it takes you
to the home screen preview.

**To preview on your phone instead** (closer to the real native experience):

```bash
npm run app            # expo start — prints a QR code
```

Install **Expo Go** (App Store / Play Store) on your phone, make sure it's on
the same Wi-Fi as your computer, and scan the QR code from the terminal.

**iOS/Android simulators** need Xcode or Android Studio installed first:

```bash
npm run app:ios        # iOS simulator
npm run app:android    # Android emulator
```

### Known gotcha: npm cache permissions

If `npm install` fails with an `EACCES` / `EEXIST` error inside
`~/.npm/_cacache`, it means some cache files are root-owned (typically left
over from a past `sudo npm install` on the machine, not from this project).
Fix once, machine-wide:

```bash
sudo chown -R $(whoami) ~/.npm
```

## Status

Scaffold only — see `docs/DESIGN.md` §5 "Open items" for what's still undecided
(backend project, monorepo build tool, content migration plan).
