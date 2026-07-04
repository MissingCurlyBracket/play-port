# Component Inventory — Frontend SPA (web)

**Date:** 2026-07-05
**Part:** `src/`
**Design system:** Atomic design (atoms → molecules → organisms → templates → pages), MUI dark theme (`src/theme.ts`).

The UI is layered so that MUI usage is centralized in `Base*` atoms; higher tiers
compose atoms and never call MUI primitives directly (with minor exceptions like
`IconButton`). Pages are presentational and receive data + callbacks as props.

## Atoms — `src/components/atoms/` (15)

Thin wrappers around MUI primitives (and two loaders), giving the app a single
place to standardize styling/props.

| Component | Wraps / Purpose |
|---|---|
| `BaseAlert` | MUI `Alert` — inline error/info messages |
| `BaseAutocomplete` | MUI `Autocomplete` — used by region/provider selects |
| `BaseBox` | MUI `Box` — layout primitive (used pervasively) |
| `BaseButton` | MUI `Button` |
| `BaseCard` | MUI `Card` — translucent blurred surface per theme |
| `BaseChip` | MUI `Chip` — media-type / IMDb / metadata chips |
| `BaseContainer` | MUI `Container` — page width constraint |
| `BaseDialog` | MUI `Dialog` — modal shell |
| `BaseImage` | `<img>` wrapper — posters/logos |
| `BasePaper` | MUI `Paper` |
| `BaseTextField` | MUI `TextField` — search input base |
| `BaseTooltip` | MUI `Tooltip` — e.g. "set your preferences" hint |
| `BaseTypography` | MUI `Typography` |
| `LoadingSpinner` | Spinner atom |
| `SkeletonCard` | boneyard-js skeleton wrapper (renders bone shapes while `loading`) |

## Molecules — `src/components/molecules/` (7)

| Component | Purpose |
|---|---|
| `BackdropHero` | Full-bleed backdrop image with gradient/blur; used by both the home layout and the title page hero |
| `SearchBar` | Debounced search input (wraps `BaseTextField`); controlled `value`/`onChange`, loading state |
| `TitleItem` | A single search result row (poster, title, year, overview); links to the title page; supports skeleton/`interactive={false}` mode |
| `SourceItem` | A streaming-provider tile (logo, name, link out); used on the title page's "Available on" grid |
| `RegionSelect` | Region picker (autocomplete over `Region[]`) |
| `ProviderSelect` | Multi-select of providers for the chosen region |
| `SuggestionButtons` | "Suggest a movie / TV show" buttons; disabled until preferences set; per-type loading state |

## Organisms — `src/components/organisms/` (1)

| Component | Purpose |
|---|---|
| `PreferencesDialog` | Modal combining `RegionSelect` + `ProviderSelect`; lets the user pick a region and subscribed providers, then save (persisted to cookies by `MainPage`) |

## Templates — `src/components/templates/` (1)

| Component | Purpose |
|---|---|
| `MainPageTemplate` | Home-page layout: fixed full-screen `BackdropHero`, header slot (preferences button), hero copy, suggestion buttons, search bar, results/error region, and the preferences dialog. Pure layout — all content passed as props. |

## Pages — `src/pages/` (2)

Presentational; own only view-local state, receive data/handlers as props.

| Page | Rendered by | Responsibility |
|---|---|---|
| `MainPage` | `routes/index.tsx` | Search (debounced), preferences dialog + cookie persistence, suggestion navigation, results/skeleton/empty states |
| `TitlePage` | `routes/title/$type/$id.tsx` | Backdrop hero, expandable overview (clamp via `ResizeObserver`), IMDb/genre/director/cast panel, provider tile grid + skeletons + empty state |

## Supporting modules

| Module | Purpose |
|---|---|
| `src/helpers/convertType.ts` | `"movie"→"Movie"`, `"tv"→"TV Series"` label mapping |
| `src/helpers/getImdbUrl.ts` | Build an IMDb title URL from an imdb id |
| `src/helpers/getProviderUrl.ts` | Map a provider id to its watch/home URL |
| `src/utils/cookies.ts` | Read `region` / `providers` cookies |
| `src/bones/registry.ts` + `*.bones.json` | boneyard-js skeleton shape registration for `TitleItem` and `SourceItem` |
| `src/mocks/*` | MSW worker + fixtures (dev only) |

## Conventions for adding components

- Wrap new MUI primitives as a `Base*` atom rather than importing MUI directly in
  higher tiers.
- Keep pages presentational; fetch/prefetch in the route container and pass data
  down.
- If a component has a loading skeleton, capture its bone shape via
  `/dev/bones` + `npm run capture-bones` and register it in `src/bones/`.

---

_Generated using BMAD Method `document-project` workflow_
