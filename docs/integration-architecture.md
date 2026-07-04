# Integration Architecture

**Date:** 2026-07-05
**Parts:** web (`src/`) ↔ backend (`functions/`) ↔ TMDB/OMDb

## How the parts communicate

play-port is a two-hop system:

```
Browser (React SPA)                 AWS Lambda (Serverless API)          Upstream
──────────────────                  ───────────────────────────         ────────────
src/api/*Api.ts  ──HTTP GET(JSON)──▶  functions/handler.ts  ──HTTPS──▶   api.themoviedb.org/3
   (VITE_API_BASE_URL)                 (TMDB_READ_ACCESS_TOKEN)          www.omdbapi.com
        ▲                                     │
        └───────────── JSON DTO ──────────────┘
```

1. **SPA → backend:** The six API clients in `src/api/` issue `GET` requests to
   `VITE_API_BASE_URL`. They are instantiated once in `src/main.tsx` and injected
   through TanStack Router `context`, so routes read them via
   `Route.useRouteContext()` rather than importing them.
2. **backend → upstream:** Each Lambda handler calls TMDB (bearer token) and, for
   title detail, OMDb (api key), then maps the response to a lean DTO.
3. **backend → SPA:** JSON DTO with `Access-Control-Allow-Origin: *`.

The browser **never** holds a TMDB/OMDb credential — token isolation is the main
reason the backend exists.

## Integration points

### web → backend (HTTP)

- **Location:** `src/api/*.ts`
- **Type:** REST-ish `GET` over `fetch`, JSON in/out.
- **Contract:** [api-contracts-backend.md](./api-contracts-backend.md).
- **Client map:**

  | Client | Endpoint(s) |
  |---|---|
  | `SearchApi` | `/search?name=` |
  | `TitleApi` | `/{type}/{id}`, `/{type}/{id}/providers?region=&providers=` |
  | `RegionApi` | `/regions` |
  | `ProviderApi` | `/providers?region=` |
  | `TrendingApi` | `/trending` |
  | `PopularApi` | `/popular/{type}?region=&providers=` |

### backend → TMDB / OMDb (HTTPS)

- **Location:** `functions/handler.ts`
- **Type:** Outbound `fetch`; TMDB v3 (`Authorization: Bearer`), OMDb (`?apikey=`).
- **Auth material:** `TMDB_READ_ACCESS_TOKEN`, `OMDB_API_KEY` (Lambda env vars).

## Preference flow (cookies → query params)

User preferences are owned by the client and flow to the backend as params:

1. In `PreferencesDialog`, the user selects a region + providers.
2. `MainPage.handleSaveSettings` writes `region=<code>` and
   `providers=<id,id,...>` cookies (`max-age=31536000`).
3. `src/utils/cookies.ts` reads them; route loaders/components pass `region` and
   `providers` into `TitleApi.getProviders` and `PopularApi.getPopular`.
4. The backend filters upstream results by those params.

No preference data ever reaches a server datastore — there isn't one.

## Data prefetch flow (TanStack Query)

Route `loader`s warm the React Query cache before a page renders:

- `/` loader prefetches `['regions']` and `['trending']`.
- `/title/$type/$id` loader prefetches `['title', type, id]` and
  `['providers', type, id, region, providers]` (region/providers from cookies).

Components then call `useQuery` with the same keys and render immediately from
cache. Search uses a `useMutation` (`['search']`) driven by a 400ms debounced
input.

## Dev-mode integration (MSW)

In `import.meta.env.DEV`, `src/main.tsx` starts an MSW service worker
(`/play-port/mockServiceWorker.js`) **before** rendering. `src/mocks/handler.ts`
intercepts every backend path (`*/search`, `*/trending`, `*/popular/:type`,
`*/{movie,tv}/:id`, `*/{movie,tv}/:id/providers`, `*/regions`, `*/providers`) and
returns fixtures — so the SPA runs with **no backend and no TMDB token**. The
search and provider mocks add a 2s delay to exercise skeleton loaders. Unhandled
requests fall through (logged, not blocked).

This means the frontend and backend can be developed independently: MSW fixtures
are the shared contract, and they must be kept in sync with
[api-contracts-backend.md](./api-contracts-backend.md).

## Shared type contract

DTO interfaces are declared once in `src/api/*` and imported by both the pages
and the MSW mocks. The backend constructs matching JSON by hand in
`functions/handler.ts` (there is no generated/shared schema package), so the DTO
types in `src/api/` are the source of truth for the contract — see
[data-models-backend.md](./data-models-backend.md).

## Environment coupling

| Variable | Side | Role in integration |
|---|---|---|
| `VITE_API_BASE_URL` | frontend (build-time) | Where the API clients send requests |
| `TMDB_READ_ACCESS_TOKEN` | backend (runtime) | Auth to TMDB |
| `OMDB_API_KEY` | backend (runtime) | Auth to OMDb (optional; enables IMDb enrichment) |

## Change checklist (keeping the seam consistent)

Adding or changing an endpoint touches all three layers:

1. **Backend:** handler in `functions/handler.ts` + route in `serverless.yml`.
2. **Frontend:** a `src/api/*` client method (+ inject in `main.tsx`/`__root.tsx` if new client).
3. **Dev mocks:** matching handler in `src/mocks/handler.ts`.
4. **Docs:** update `api-contracts-backend.md` and `data-models-backend.md`.

---

_Generated using BMAD Method `document-project` workflow_
