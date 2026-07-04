# Data Models — Serverless API (backend)

**Date:** 2026-07-05
**Part:** `functions/`

## Persistence

**There is no database.** play-port stores no server-side data. Every request is
served by fetching live from TMDB (and OMDb for IMDb enrichment) and reshaping the
response. The only persisted state in the whole system is client-side: the user's
`region` and `providers` cookies (see `src/utils/cookies.ts`). "Data models" here
therefore means the **DTO contracts** exchanged over HTTP and the **upstream
shapes** they are derived from.

## Outbound DTOs (backend → frontend)

These are the lean shapes the SPA consumes. The TypeScript definitions live
alongside their API clients in `src/api/` and are re-used by the backend
conceptually (the backend constructs matching JSON in `functions/handler.ts`).

### SearchResult — `src/api/SearchApi.ts`

```ts
interface SearchResult {
  id: number;
  title: string;
  overview: string;
  release_date: string;   // year only
  media_type: string;     // "movie" | "tv"
  poster_url?: string;
}
```

### Provider — `src/api/TitleApi.ts`

```ts
interface Provider {
  provider_id: number;
  provider_name: string;
  logo_url: string;
}
```

Reused by `TitleApi.getProviders`, `ProviderApi.getProviders`.

### TitleDetails — `src/api/TitleApi.ts`

```ts
interface TitleDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;          // year only
  media_type: 'movie' | 'tv';
  backdrop_url: string;
  poster_url: string;
  imdb_id?: string;
  imdb_rating?: string;          // from OMDb
  genre?: string;                // from OMDb
  director?: string;             // from OMDb
  actors?: string[];             // from OMDb, up to 4
}
```

### Region — `src/api/RegionApi.ts`

```ts
interface Region {
  code: string;   // ISO-3166-1 (iso_3166_1)
  name: string;   // english_name
}
```

### TrendingMovie — `src/api/TrendingApi.ts`

```ts
interface TrendingMovie {
  id: number;
  title: string;
  backdrop_url: string;
  poster_url: string;
}
```

### PopularTitle — `src/api/PopularApi.ts`

```ts
interface PopularTitle {
  id: number;
  title: string;
  media_type: 'movie' | 'tv';
  poster_url: string;
  backdrop_url: string;
}
```

## Upstream shapes (TMDB / OMDb → backend)

These are the raw shapes the handlers parse before mapping to DTOs. Full
definitions are the `Tmdb*` / `Omdb*` interfaces in `functions/handler.ts`.

| Upstream type | Source endpoint | Mapped into |
|---|---|---|
| `TmdbMultiSearchResult` | `search/multi` | `SearchResult` |
| `TmdbProvidersResponse` | `{movie,tv}/{id}/watch/providers` | `Provider[]` (flatrate) |
| `TmdbRegionsResponse` / `Region` | `watch/providers/regions` | `Region[]` |
| `TmdbAvailableProvidersResponse` | `watch/providers/{movie,tv}` | `Provider[]` |
| `TmdbTrendingItem` | `trending/movie/week` | `TrendingMovie` / `PopularTitle` |
| `TmdbMovieDetails` / `TmdbTvDetails` (+ `external_ids`) | `{movie,tv}/{id}` | `TitleDetails` |
| `OmdbInfo` | `omdbapi.com` | `imdb_rating`/`genre`/`director`/`actors` on `TitleDetails` |

### Mapping conventions

- **Dates → year:** `release_date` / `first_air_date` are split on `-` and only the
  year is kept.
- **Image URLs:** composed against `https://image.tmdb.org/t/p/<size>/<path>` —
  `w92` (posters/logos in lists), `w500` (posters), `w1280` (backdrops); empty
  string when the upstream path is missing.
- **Title fallback:** first non-empty of `title` / `name` / `original_title` /
  `original_name`.
- **OMDb `N/A` handling:** any `"N/A"` value is treated as absent; `actors` is
  split on commas and trimmed to the first four.

## Notes

- No migrations, ORM, or schema files exist or are needed.
- If persistence is ever introduced (e.g. caching TMDB responses, user accounts),
  this document and `architecture-backend.md` should be updated with the new
  datastore, schema, and migration strategy.

---

_Generated using BMAD Method `document-project` workflow_
