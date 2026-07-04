# Deployment Guide

**Date:** 2026-07-05
**Targets:** GitHub Pages (frontend SPA) + AWS Lambda via Serverless Framework (backend).

## Overview

Both parts deploy from a **single GitHub Actions workflow**
(`.github/workflows/main.yml`) that runs on every push to `master` (and via
`workflow_dispatch`). The job builds the SPA, deploys the Serverless backend, then
publishes the SPA to GitHub Pages.

```
push to master ──▶ GitHub Actions (ubuntu-latest, Node 24)
                      ├─ npm install
                      ├─ npm run build            (VITE_API_BASE_URL from secret)
                      ├─ npx serverless deploy     (AWS + TMDB/OMDb secrets)  ──▶ AWS Lambda (eu-central-1)
                      └─ npm run deploy            (gh-pages)                 ──▶ GitHub Pages
```

Live site: `https://missingcurlybracket.github.io/play-port/`.

## CI/CD pipeline (`.github/workflows/main.yml`)

Steps, in order:

1. **Checkout** (`actions/checkout@v5`, using `GITHUB_TOKEN`).
2. **Setup Node** 24 (`actions/setup-node@v5`).
3. **Configure git** as `github-actions[bot]` (needed for the `gh-pages` push).
4. **Install** — `npm install`.
5. **Build** — `npm run build`, with `VITE_API_BASE_URL` from `secrets.API_BASE_URL`.
6. **Deploy Serverless** — `npx serverless deploy` with AWS + TMDB/OMDb secrets.
7. **Deploy GitHub Pages** — `npm run deploy` (publishes `dist/` via `gh-pages`),
   again with `VITE_API_BASE_URL`.

`permissions: contents: write` is granted so the Pages branch can be pushed.

### Required GitHub Actions secrets

| Secret | Used by | Purpose |
|---|---|---|
| `API_BASE_URL` | build + pages deploy | Injected as `VITE_API_BASE_URL` |
| `SERVERLESS_ACCESS_KEY` | serverless deploy | Serverless Framework auth |
| `AWS_ACCESS_KEY_ID` | serverless deploy | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | serverless deploy | AWS credentials |
| `TMDB_READ_ACCESS_TOKEN` | serverless deploy | TMDB token → Lambda env |
| `OMDB_API_KEY` | serverless deploy | OMDb key → Lambda env |
| `GITHUB_TOKEN` | checkout + pages | Provided automatically by Actions |

## Frontend deployment details

- **Build:** `npm run build` = `tsc -b && vite build` → static assets in `dist/`.
- **Base path:** `vite.config.ts` sets `base: '/play-port/'` to match the Pages
  project URL. The MSW worker is disabled in production builds (dev-only gate).
- **Publish:** `gh-pages -d dist` (`npm run deploy`, with `predeploy` running the
  build). Deep links work because the SPA uses hash history.
- **Manual deploy:** `npm run deploy` from a machine with repo push rights and
  `VITE_API_BASE_URL` set.

## Backend deployment details

- **Tooling:** Serverless Framework 4 (`serverless.yml`), esbuild bundling.
- **Provider:** AWS, runtime `nodejs24.x`, region `eu-central-1`.
- **Command:** `npx serverless deploy` (provisions the HTTP API + 10 Lambda
  functions). Requires AWS credentials, `SERVERLESS_ACCESS_KEY`, and the TMDB/OMDb
  env vars in scope.
- **Runtime env vars:** `TMDB_READ_ACCESS_TOKEN`, `OMDB_API_KEY` (from
  `${env:...}` in `serverless.yml`).
- **Remove a deployment:** `npx serverless remove` (tears down the stack).

## Environments

There is a single environment (production). Preview/staging environments are not
configured; changes go live on merge to `master`. The API base URL the frontend
targets is entirely determined by the `API_BASE_URL` secret at build time.

## Rollback

- **Frontend:** revert the offending commit on `master` (re-triggers the workflow)
  or re-run a prior successful workflow.
- **Backend:** re-deploy from a previous commit, or use Serverless/AWS mechanisms
  to roll back the function versions.

## Operational notes

- The pipeline deploys backend **before** Pages, so a broken `serverless deploy`
  fails the run before the new frontend is published.
- No automated tests currently gate the deploy — consider adding `npm run test` /
  `npm run lint` as pre-deploy steps.

## Related docs

- [architecture-backend.md](./architecture-backend.md) — what gets deployed
- [development-guide.md](./development-guide.md) — running the same commands locally

---

_Generated using BMAD Method `document-project` workflow_
