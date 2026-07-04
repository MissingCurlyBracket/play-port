# play-port - Project Overview

**Date:** 2026-07-05
**Type:** Multi-part (client SPA + serverless API)
**Architecture:** Static SPA on a CDN calling a stateless serverless proxy

## Executive Summary

play-port answers one question: "Where can I watch this?" A user searches for a
movie or TV show, and the app lists the streaming providers that carry it in the
user's region, optionally filtered to the services the user actually subscribes
to. The home screen also surfaces trending backdrops and "suggest me something"
buttons that pick a random popular title available on the user's services.

The product is deliberately backend-light: there is no database and no user
accounts. Preferences (region + provider IDs) live in browser cookies, and all
content data is fetched live from TMDB, enriched with IMDb rating/genre/
director/cast from OMDb. The serverless layer exists mainly to keep the TMDB and
OMDb API tokens off the client and to reshape verbose upstream payloads into lean
DTOs the SPA can render directly.

## Project Classification

- **Repository Type:** Multi-part (single npm package, two deploy targets)
- **Project Type(s):** web (React SPA), backend (AWS Lambda serverless API)
- **Primary Language(s):** TypeScript
- **Architecture Pattern:** Client–server with a thin stateless proxy; component-based UI

## Multi-Part Structure

This project consists of 2 distinct parts:

### Frontend SPA

- **Type:** web
- **Location:** `src/`
- **Purpose:** The user-facing single-page application — search, preferences, title detail, suggestions.
- **Tech Stack:** React 19, TypeScript, Vite 7, TanStack Router, TanStack React Query, MUI 7, Tailwind CSS 4, MSW (dev mocks), boneyard-js (skeletons)

### Serverless API

- **Type:** backend
- **Location:** `functions/`
- **Purpose:** Stateless HTTP proxy in front of TMDB (+ OMDb), hiding API tokens and reshaping responses.
- **Tech Stack:** AWS Lambda (Node.js 24.x), Serverless Framework 4, HTTP API (API Gateway), esbuild

### How Parts Integrate

The SPA's `src/api/*` clients call the Lambda HTTP API at `VITE_API_BASE_URL`.
Each handler in `functions/handler.ts` calls the upstream TMDB endpoint with the
bearer token, maps the result into a compact DTO, and returns JSON with
permissive CORS headers. Region and provider preferences are read from cookies
on the client and forwarded as query-string parameters. See
[integration-architecture.md](./integration-architecture.md).

## Technology Stack Summary

### Frontend SPA Stack

| Category | Technology | Version | Notes |
|---|---|---|---|
| Language | TypeScript | ~5.9 | Strict typing across app + functions |
| UI library | React | 19.1 | Function components + hooks |
| Build tool | Vite | 7.3 | `base: '/play-port/'`, single manual chunk |
| Routing | TanStack Router | 1.130 | File-based routes, hash history, code-splitting |
| Server state | TanStack React Query | 5.84 | Route loaders prefetch; components `useQuery` |
| Component UI | MUI (Material UI) | 7.3 | Dark theme, wrapped as Base* atoms |
| Styling | Tailwind CSS | 4.1 | Via `@tailwindcss/vite` |
| Fonts | @fontsource/roboto | 5.2 | Self-hosted Roboto weights |
| Mock server | MSW | 2.10 | Dev-only request interception |
| Skeletons | boneyard-js | 1.8 | Captured "bone" shapes for loaders |
| Debounce | use-debounce | 10.0 | Search input debouncing |
| Tests | Vitest + Chai + jsdom | 4.1 / 6.2 | `globals: true` |

### Serverless API Stack

| Category | Technology | Version | Notes |
|---|---|---|---|
| Language | TypeScript | ~5.9 | Compiled per `functions/tsconfig.json` |
| Runtime | Node.js | 24.x | AWS Lambda |
| Framework | Serverless Framework | 4.33 | `serverless.yml` |
| Local dev | serverless-offline | 14.5 | `npx serverless offline` |
| Bundler | esbuild | 0.27 | `bundle: true`, target node20, sourcemaps |
| HTTP | API Gateway HTTP API | — | `httpApi` events, all `GET` |
| Region | AWS eu-central-1 | — | Set in `serverless.yml` |
| Data types | @types/aws-lambda | 8.10 | `APIGatewayProxyEvent` typings |

## Key Features

- **Search** — multi-search across TMDB movies + TV, debounced input.
- **Per-title providers** — flatrate providers for a title, optionally scoped to a region and the user's subscribed provider IDs.
- **Preferences** — region + provider selection stored in cookies (1-year max-age), surfaced through a preferences dialog.
- **Suggestions** — "suggest a movie / TV show" picks a random popular title that is available on the user's services.
- **Title detail page** — backdrop hero, expandable overview, IMDb rating/genre/director/cast, and clickable provider tiles.
- **Trending backdrop** — home hero uses a random trending movie backdrop.

## Architecture Highlights

- **Token isolation:** TMDB/OMDb tokens live only in Lambda env vars; the client only knows `VITE_API_BASE_URL`.
- **No datastore:** entirely stateless; every request proxies upstream. Preferences persist client-side in cookies.
- **Dependency-injected API clients:** the six API client instances are created once in `main.tsx` and passed through TanStack Router context, so routes/pages receive them without imports — this also makes them trivially mockable in tests.
- **Prefetch-on-navigate:** route `loader`s prefetch React Query data so pages render populated.
- **Dev/prod parity via MSW:** in `import.meta.env.DEV`, a service worker serves fixtures so the SPA runs with no backend.

## Development Overview

### Prerequisites

Node.js 24 and npm. A TMDB v3 read access token is required to run the real
backend (`TMDB_READ_ACCESS_TOKEN`); OMDb key (`OMDB_API_KEY`) is optional and
enables IMDb enrichment.

### Getting Started

`npm install`, then `npm run dev` for the SPA (mocked backend), or
`npx serverless offline` to run the real Lambda handlers locally. See the
[development guide](./development-guide.md).

### Key Commands

- **Install:** `npm install`
- **Dev (SPA):** `npm run dev`
- **Build:** `npm run build`
- **Test:** `npm run test`
- **Lint / Typecheck:** `npm run lint` / `npm run typecheck`
- **Local backend:** `npx serverless offline`

## Repository Structure

Single npm package. `src/` is the SPA, `functions/` is the Lambda API,
`scripts/` holds a boneyard remap helper, `public/` holds static assets + the
MSW service worker, and `docs/` (this folder) holds generated documentation.
The whole thing is deployed by a single GitHub Actions workflow on push to
`master`.

## Documentation Map

For detailed information, see:

- [index.md](./index.md) - Master documentation index
- [architecture-web.md](./architecture-web.md) / [architecture-backend.md](./architecture-backend.md) - Detailed architecture per part
- [source-tree-analysis.md](./source-tree-analysis.md) - Directory structure
- [development-guide.md](./development-guide.md) - Development workflow

---

_Generated using BMAD Method `document-project` workflow_
