# API Contracts — Serverless API (backend)

**Date:** 2026-07-05
**Part:** `functions/`
**Base URL:** value of `VITE_API_BASE_URL` (frontend) → API Gateway HTTP API
**Auth:** none (public, read-only). All responses include
`Access-Control-Allow-Origin: *` and `Content-Type: application/json`.

All endpoints are `GET`. Error responses use `{ "error": <string> }`. Handlers
return `400` for missing required params, propagate the upstream status on a
non-OK TMDB response, and return `500 { "error": "Internal server error" }` on an
unexpected exception. Source: `functions/handler.ts`; routes: `serverless.yml`.

---

## GET /search

Multi-search TMDB for movies and TV shows.

- **Query params:** `name` (required) — search string.
- **Errors:** `400` if `name` missing.
- **Response:** `SearchResult[]` (movies + TV only; `person` results filtered out).

```jsonc
[
  {
    "id": 120982,
    "title": "Alan Partridge: Alpha Papa",
    "overview": "…",
    "release_date": "2013",        // year only (split from YYYY-MM-DD)
    "media_type": "movie",          // "movie" | "tv"
    "poster_url": "https://image.tmdb.org/t/p/w92/..."  // "" if no poster
  }
]
```

## GET /movie/{movieId}/providers

Flatrate streaming providers for a movie.

- **Path:** `movieId` (required).
- **Query params:** `region` (optional, ISO-3166-1), `providers` (optional CSV of provider IDs).
- **Behavior:** with `region` → that region's `flatrate` list; without `region` → flatrate providers de-duplicated across all regions. If `providers` is given, results are filtered to those provider IDs.
- **Errors:** `400` if `movieId` missing.
- **Response:** `Provider[]` (empty array if the region has no entry).

```jsonc
[
  { "provider_id": 8, "provider_name": "Netflix", "logo_url": "https://image.tmdb.org/t/p/w92/..." }
]
```

## GET /tv/{seriesId}/providers

Identical to the movie variant, for TV series.

- **Path:** `seriesId` (required).
- **Query params:** `region` (optional), `providers` (optional CSV).
- **Errors:** `400` if `seriesId` missing.
- **Response:** `Provider[]`.

## GET /regions

Watch-provider regions supported by TMDB.

- **Params:** none.
- **Response:** `Region[]`.

```jsonc
[
  { "code": "US", "name": "United States" }   // code = iso_3166_1, name = english_name
]
```

## GET /providers

All watch providers available in a region (union of movie + TV providers, de-duped).

- **Query params:** `region` (ISO-3166-1). *(Passed as `watch_region` upstream; if omitted, TMDB receives `region=undefined`.)*
- **Response:** `Provider[]` (`provider_id`, `provider_name`, `logo_url`).

## GET /trending

Trending movies for the week.

- **Params:** none.
- **Behavior:** fetches 3 pages concurrently, keeps items that have a backdrop, slices to 50.
- **Response:** `TrendingMovie[]`.

```jsonc
[
  {
    "id": 123,
    "title": "…",                                   // first non-empty of title/name/original_*
    "backdrop_url": "https://image.tmdb.org/t/p/w1280/...",
    "poster_url": "https://image.tmdb.org/t/p/w500/..."  // "" if none
  }
]
```

## GET /movie/{movieId}

Movie detail, enriched with IMDb data from OMDb.

- **Path:** `movieId` (required).
- **Behavior:** TMDB `movie/{id}?append_to_response=external_ids`; if an IMDb id is present and `OMDB_API_KEY` is set, augments with OMDb rating/genre/director/first-4 actors. OMDb failures are swallowed (fields simply omitted).
- **Errors:** `400` if `movieId` missing.
- **Response:** `TitleDetails`.

```jsonc
{
  "id": 120982,
  "title": "Alan Partridge: Alpha Papa",
  "overview": "…",
  "release_date": "2013",          // year only
  "media_type": "movie",
  "backdrop_url": "https://image.tmdb.org/t/p/w1280/...",  // "" if none
  "poster_url": "https://image.tmdb.org/t/p/w500/...",     // "" if none
  "imdb_id": "tt2378281",          // optional
  "imdb_rating": "6.6",            // optional (from OMDb)
  "genre": "Comedy, Crime, Thriller", // optional
  "director": "Declan Lowney",     // optional
  "actors": ["Steve Coogan", "Colm Meaney", "…"]  // optional, up to 4
}
```

## GET /tv/{seriesId}

TV detail, same shape as movie detail (`media_type: "tv"`, `release_date` from
`first_air_date`, IMDb id from `external_ids`).

- **Path:** `seriesId` (required).
- **Errors:** `400` if `seriesId` missing.
- **Response:** `TitleDetails`.

## GET /popular/movie

Popular movies, optionally filtered to titles available on the user's providers.

- **Query params:** `region` (optional), `providers` (optional CSV).
- **Behavior:** fetches TMDB `movie/popular`. If **both** `region` and `providers`
  are given, checks each title's `watch/providers` and keeps only those available
  (flatrate/rent/buy) on the requested provider IDs; otherwise returns the top 10.
- **Response:** `PopularTitle[]`.

```jsonc
[
  {
    "id": 123,
    "title": "…",
    "media_type": "movie",   // "movie" | "tv"
    "poster_url": "https://image.tmdb.org/t/p/w500/...",   // "" if none
    "backdrop_url": "https://image.tmdb.org/t/p/w1280/..." // "" if none
  }
]
```

## GET /popular/tv

Identical to `/popular/movie`, for TV (`media_type: "tv"`).

---

## Consumed by (frontend client map)

| Endpoint | Client (`src/api/`) | Method |
|---|---|---|
| `/search` | `SearchApi` | `search({ name })` |
| `/{type}/{id}/providers` | `TitleApi` | `getProviders({ type, id, region?, providers? })` |
| `/{type}/{id}` | `TitleApi` | `getTitle({ type, id })` |
| `/regions` | `RegionApi` | `getRegions()` |
| `/providers` | `ProviderApi` | `getProviders({ region })` |
| `/trending` | `TrendingApi` | `getTrending()` |
| `/popular/{type}` | `PopularApi` | `getPopular({ type, region?, providers? })` |

Dev fixtures mirroring these contracts live in `src/mocks/handler.ts`.

---

_Generated using BMAD Method `document-project` workflow_
