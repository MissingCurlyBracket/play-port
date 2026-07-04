# Architecture — Serverless API (backend)

**Date:** 2026-07-05
**Part:** `functions/`
**Project Type:** backend (AWS Lambda serverless API)

## Executive Summary

The backend is a set of stateless AWS Lambda functions (Node.js 24) fronted by an
API Gateway HTTP API, defined and deployed with the Serverless Framework
(`serverless.yml`) to `eu-central-1`. Every function is a thin proxy over
[TMDB](https://www.themoviedb.org/) API v3; the title-detail functions also call
[OMDb](https://www.omdbapi.com/) to enrich a title with IMDb rating, genre,
director, and cast. The layer exists to (1) keep API tokens server-side and (2)
reshape verbose upstream JSON into lean DTOs the SPA renders directly. There is
no database and no shared runtime state.

## Technology Stack

| Category | Technology | Version | Justification |
|---|---|---|---|
| Runtime | Node.js | 24.x | Native `fetch`; modern LTS on Lambda |
| Framework | Serverless Framework | 4.33 | Declarative functions + deploy |
| Compute | AWS Lambda | — | Pay-per-request, zero idle cost |
| Gateway | API Gateway HTTP API | — | `httpApi` events, all `GET` |
| Bundler | esbuild | 0.27 | Fast bundle (`bundle: true`, target node20, sourcemaps) |
| Language | TypeScript | ~5.9 | Typed upstream contracts |
| Local dev | serverless-offline | 14.5 | Emulate the HTTP API locally |
| Region | eu-central-1 | — | Configured in `serverless.yml` |

## Architecture Pattern

**Stateless function-per-endpoint proxy.** Each handler is an isolated
`async (event: APIGatewayProxyEvent) => { statusCode, headers, body }`. There is
no router, middleware stack, or shared server object — `serverless.yml` maps each
HTTP route to one exported function in `functions/handler.ts`.

Common per-handler shape:

1. Read the TMDB token from `process.env.TMDB_READ_ACCESS_TOKEN`.
2. Read path params (`movieId`/`seriesId`) and query params (`name`, `region`, `providers`).
3. Validate required params → `400` with `{ error }` if missing.
4. `fetch` the upstream TMDB endpoint with `Authorization: Bearer <token>`.
5. Propagate a non-OK upstream status, or map the payload to a compact DTO.
6. Return `200` with JSON; catch-all → `500 { error: 'Internal server error' }`.

All responses carry permissive CORS headers (`Access-Control-Allow-Origin: *`).

## Endpoints

Ten functions (see [api-contracts-backend.md](./api-contracts-backend.md) for
full detail):

| Function export | Method & path | Purpose |
|---|---|---|
| `search` | `GET /search` | Multi-search movies + TV by name |
| `getMovieProviders` | `GET /movie/{movieId}/providers` | Flatrate providers for a movie |
| `getTvProviders` | `GET /tv/{seriesId}/providers` | Flatrate providers for a TV series |
| `getRegions` | `GET /regions` | Supported watch-provider regions |
| `getAvailableProviders` | `GET /providers` | All providers available in a region |
| `getTrending` | `GET /trending` | Trending movies (this week), ~50 with backdrops |
| `getMovieDetails` | `GET /movie/{movieId}` | Movie detail + IMDb enrichment |
| `getTvDetails` | `GET /tv/{seriesId}` | TV detail + IMDb enrichment |
| `getPopularMovies` | `GET /popular/movie` | Popular movies, optionally filtered by availability |
| `getPopularTvShows` | `GET /popular/tv` | Popular TV, optionally filtered by availability |

## Data Architecture

No datastore. Data is fetched live from TMDB/OMDb per request. Upstream response
shapes and the outbound DTOs are documented in
[data-models-backend.md](./data-models-backend.md). Preference state (region,
provider IDs) is owned by the client (cookies) and passed in as query params.

### Upstream dependencies

- **TMDB v3** (`https://api.themoviedb.org/3/...`): search/multi, watch/providers,
  watch/providers/regions, watch/providers/{movie,tv}, trending/movie/week,
  {movie,tv}/{id} (with `append_to_response=external_ids`), {movie,tv}/popular.
  Image URLs are composed against `https://image.tmdb.org/t/p/<size>/`.
- **OMDb** (`https://www.omdbapi.com/?i=<imdbId>&apikey=...`): IMDb rating, genre,
  director, first four actors. Called only from the detail handlers, gated on
  `OMDB_API_KEY`; failures degrade gracefully (fields omitted).

## Notable Implementation Details

- **Provider filtering:** `getMovieProviders`/`getTvProviders` accept a
  `providers` CSV of provider IDs; without a `region` they de-dupe flatrate
  providers across all regions, with a `region` they return that region's flatrate
  set (both optionally filtered to the requested provider IDs).
- **Availability-aware popularity:** `getPopular*` fetch popular titles, then (if
  `region` + `providers` given) fan out one `watch/providers` call per title and
  keep only those available on the requested providers (flatrate/rent/buy);
  otherwise returns the top 10.
- **Trending pagination:** `getTrending` fetches `ceil(50/20)=3` pages
  concurrently, keeps items with a backdrop, and slices to 50.
- **Fail-fast on fan-out:** trending propagates the first failed page's status.

## Development Workflow

`npx serverless offline` runs the HTTP API locally. Requires
`TMDB_READ_ACCESS_TOKEN` (and optionally `OMDB_API_KEY`) in the environment. See
[development-guide.md](./development-guide.md).

## Deployment Architecture

`npx serverless deploy` (run in CI on push to `master`) provisions/updates the
Lambda functions + HTTP API in `eu-central-1`. Env vars come from GitHub Actions
secrets. See [deployment-guide.md](./deployment-guide.md).

## Testing Strategy

No backend-side tests currently. Handlers are pure `event → response` functions,
so they are straightforward to unit test by stubbing `fetch`. The frontend's MSW
handlers mirror these contracts for integration-level confidence.

## Notable Constraints & Gotchas

- **Env-var declaration:** `serverless.yml` injects `TMDB_READ_ACCESS_TOKEN` and
  `OMDB_API_KEY`; the inline `process` typing in `handler.ts` only declares
  `TMDB_READ_ACCESS_TOKEN` but reads `OMDB_API_KEY` via the index signature.
- **CORS is wide open** (`*`) — acceptable for a public read-only proxy; revisit if
  auth or write endpoints are ever added.
- **Adding an endpoint = two edits:** export a handler in `handler.ts` **and** add
  the function + `httpApi` event in `serverless.yml` (plus an MSW mock for dev).

---

_Generated using BMAD Method `document-project` workflow_
