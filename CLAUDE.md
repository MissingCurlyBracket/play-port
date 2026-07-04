# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Play-port is a streaming service locator that helps users find where to watch movies and TV shows. It has a React SPA frontend deployed to GitHub Pages and an AWS Lambda serverless backend that proxies the TMDB (The Movie Database) API.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` (runs `tsc -b && vite build`) |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Run tests | `npm run test` |
| Run tests with UI | `npm run test:ui` |
| Run single test | `npx vitest run path/to/file.test.ts` |
| Local backend | `npx serverless offline` |
| Deploy | `npm run deploy` (GitHub Pages) |

## Architecture

### Frontend (`/src`)

- **React 19 + TypeScript + Vite** with TanStack Router (file-based routing) and TanStack React Query for server state
- **Styling**: Tailwind CSS + Material-UI (MUI)
- **Atomic design** component structure: `components/atoms/` (MUI wrappers like BaseButton, BaseBox), `components/molecules/` (SearchBar, TitleItem, RegionSelect), `components/organisms/` (PreferencesDialog), `components/templates/` (page layouts)
- **Routes** in `src/routes/` — TanStack Router auto-generates `src/routeTree.gen.ts` (do not edit manually)
- **API clients** in `src/api/` — class-based with interfaces (SearchApi, TitleApi, RegionApi, ProviderApi). Injected via router context, making them available to all routes
- **MSW** (`src/mocks/`) provides mock API handlers in dev mode, initialized conditionally in `main.tsx`
- **User preferences** (region, providers) stored in browser cookies

### Backend (`/functions`)

- AWS Lambda functions defined in `serverless.yml`, built with esbuild
- `functions/handler.ts` exports all Lambda handlers that proxy TMDB API v3 (detail endpoints also enrich with IMDb data from OMDb)
- Endpoints: `/search`, `/movie/{movieId}/providers`, `/tv/{seriesId}/providers`, `/regions`, `/providers`, `/trending`, `/movie/{movieId}`, `/tv/{seriesId}`, `/popular/movie`, `/popular/tv`
- Adding an endpoint requires both a handler export in `functions/handler.ts` and a function entry in `serverless.yml` (plus a matching MSW mock in `src/mocks/handler.ts`)
- Runtime: Node.js 24.x, deployed to eu-central-1

### Environment Variables

- `VITE_API_BASE_URL` — backend API URL (frontend, set in `.env`)
- `TMDB_READ_ACCESS_TOKEN` — TMDB API bearer token (backend only)

## Code Style

- Prettier: single quotes, semicolons, trailing commas, 2-space indent, 80 char width
- ESLint flat config with TypeScript, React, React Hooks, and Prettier plugins
- Test framework: Vitest with Chai assertions and jsdom environment

## Project Documentation & BMAD

- Generated project documentation lives in `docs/` (start at `docs/index.md`): per-part architecture (`architecture-web.md`, `architecture-backend.md`), API contracts, data models, component inventory, and dev/deployment guides. Consult these first when planning changes, and keep them in sync when architecture, endpoints, or components change.
- This repo uses BMAD Method (`bmm` module) for agentic development. Agents/workflows are installed as Claude Code skills (`.claude/skills/bmad-*`); config/scripts are in `_bmad/`; planning and implementation artifacts are written to `_bmad-output/`. Use the `bmad-help` skill to find the right workflow (e.g. `bmad-prd`, `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-create-story`, `bmad-dev-story`).
