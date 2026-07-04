# Play Port

A streaming-service locator for movies and TV shows. Search a title and play-port
tells you where you can watch it in your region, using data
from [TMDB](https://www.themoviedb.org/).

Live: https://missingcurlybracket.github.io/play-port/

## Features

- Search the TMDB catalogue for movies and TV shows
- See per-title streaming providers (flatrate, rent, buy)
- Filter results by region
- Remember the user's region and preferred providers in browser cookies
- Trending and popular suggestions on the home screen

## Architecture

### Frontend (`src/`)

- React 19 + TypeScript + Vite
- [TanStack Router](https://tanstack.com/router) for file-based routing (
  `src/routes/`; `routeTree.gen.ts` is auto-generated — do not edit)
- [TanStack Query](https://tanstack.com/query) for server state
- Material UI + Tailwind CSS for styling
- Atomic component layout under `src/components/`: `atoms/`, `molecules/`,
  `organisms/`, `templates/`
- Class-based API clients in `src/api/` (`SearchApi`, `TitleApi`, `RegionApi`,
  `ProviderApi`) injected through router context
- [MSW](https://mswjs.io/) handlers in `src/mocks/` mock the backend in dev mode
  (the `/search` and provider endpoints add a 2 s delay so skeleton loaders are
  visible while developing)
- [boneyard-js](https://www.npmjs.com/package/boneyard-js) skeleton loaders
  for `TitleItem` and `SourceItem`. Bone shapes live in `src/bones/` and are
  captured from `src/routes/dev/bones.tsx` via the CLI

### Backend (`functions/`)

- AWS Lambda functions defined in `serverless.yml`, bundled with esbuild
- `functions/handler.ts` exports every handler — all of them proxy TMDB API v3
  (title-detail endpoints also enrich with IMDb data from OMDb)
- Endpoints: `/search`, `/movie/{movieId}/providers`, `/tv/{seriesId}/providers`,
  `/regions`, `/providers`, `/trending`, `/movie/{movieId}`, `/tv/{seriesId}`,
  `/popular/movie`, `/popular/tv`
- Node.js 24.x, deployed to `eu-central-1`

## Getting started

```bash
npm install
npm run dev
```

For the backend locally:

```bash
npx serverless offline
```

### Environment variables

| Variable                 | Scope             | Purpose                                       |
|--------------------------|-------------------|-----------------------------------------------|
| `VITE_API_BASE_URL`      | frontend (`.env`) | Backend API URL the SPA calls                 |
| `TMDB_READ_ACCESS_TOKEN` | backend           | TMDB v3 bearer token                          |
| `OMDB_API_KEY`           | backend           | OMDB API key for IMDb rating, genre, director, and cast (optional) |

## Scripts

| Task             | Command                               |
|------------------|---------------------------------------|
| Dev server       | `npm run dev`                         |
| Build            | `npm run build`                       |
| Lint             | `npm run lint`                        |
| Type check       | `npm run typecheck`                   |
| Run tests        | `npm run test`                        |
| Tests with UI    | `npm run test:ui`                     |
| Single test file | `npx vitest run path/to/file.test.ts` |
| Local backend    | `npx serverless offline`              |
| Capture bones    | `npm run capture-bones`               |
| Deploy frontend  | `npm run deploy`                      |

## Project layout

```
src/          React SPA (routes, components, api clients, mocks)
functions/    AWS Lambda handlers (TMDB proxy)
public/       Static assets + MSW service worker
serverless.yml  Serverless Framework config for the backend
```

## Deployment

- **Frontend** → GitHub Pages via `npm run deploy` (publishes `dist/` with
  `gh-pages`).
- **Backend** → `serverless deploy` to AWS (`eu-central-1`).

## Code style

Prettier (single quotes, semicolons, trailing commas, 2-space indent, 80-char width)
and ESLint flat config with TypeScript, React, React Hooks, and Prettier plugins.
Tests run on Vitest with Chai assertions in a jsdom environment.

## Documentation & AI-assisted development

Generated project documentation lives in [`docs/`](./docs/index.md) — start at
`docs/index.md`. It covers per-part architecture, the full API contract, data
models, the component inventory, and dev/deployment guides. These are the context
files to point AI agents at when planning features.

This repo is set up with [BMAD Method](https://bmadcode.com/) (`bmm` module) for
agentic, spec-driven development. The agents and workflows are installed as Claude
Code skills under `.claude/skills/` (all `bmad-*`); BMAD config and scripts live in
`_bmad/`, and generated planning/implementation artifacts go to `_bmad-output/`.
Invoke the `bmad-help` skill to get started, then skills like `bmad-prd`,
`bmad-architecture`, and `bmad-create-epics-and-stories` to plan new work.
