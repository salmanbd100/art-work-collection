# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # dev server → http://localhost:4200
pnpm build          # production build
pnpm test           # Karma/Jasmine unit tests (requires Chrome)
pnpm lint           # ESLint (angular-eslint v21, flat config)
pnpm lint:fix       # ESLint with auto-fix
pnpm format         # Prettier (writes)
pnpm format:check   # Prettier (read-only check)
pnpm typecheck      # tsc --noEmit (no browser needed)
```

Pre-commit hook runs `lint-staged` automatically (ESLint + Prettier on staged files).

## Architecture

**Bootstrap:** `src/main.ts` → `bootstrapApplication(RootDefaultComponent, appConfig)`.  
**Config:** `src/app/app.config.ts` — provides router (with view transitions), HttpClient (fetch backend), animations.  
**Routes:** `src/app/app.routes.ts` — all components are lazy-loaded via `loadComponent`.

**Current folder layout** (Day 1 — will be restructured on Day 2):

```
src/app/
├── app-root/          ← shell component (RootDefaultComponent), just a <router-outlet>
├── app-art-work/
│   ├── components/    ← ArtWorkListComponent (grid + filter + sort + pagination)
│   │                     ArtWorkDefaultComponent (route wrapper, router-outlet)
│   ├── interfaces/    ← ArtWorksInterface, SelectTitleOptionInterface (domain types)
│   └── services/      ← ArtWorkService (HTTP), SortUtilityService (sort comparators)
└── app-shared/
    └── art-work-card/ ← ArtWorkCardComponent (card UI), ArtWorkCardService (image probe)
```

**API:** Art Institute of Chicago public API at `https://api.artic.edu/api/v1`.  
`environment.artWork` holds the base URL. `environment.defaultImageUrl` is the fallback image.  
Images are served via IIIF: `{iiif_url}/{image_id}/full/300,/0/default.jpg`.

**Data flow (Day 1 state):** `ArtWorkListComponent` calls `ArtWorkService.GetArtWorkList()` directly, maps raw API data into `ArtWorksInterface[]`, filters and sorts in-component. This will be replaced by a signal store + mapper layer on Day 2.

**Typing rules:**

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` — do not pass `property: undefined` where the interface declares `property?: T`; instead omit the key or use conditional assignment.
- All services use `inject()` (not constructor injection).
- Zero `@ts-ignore`, zero `any` (outside spec files).

**Selector prefix:** `app-` required by ESLint (`@angular-eslint/component-selector`).  
Component files use `*.component.ts`, services `*.service.ts`.

**Styles:** Global theme in `src/styles.scss` using Angular Material 21 M3 (`mat.theme`).  
Component styles use SCSS. No Aquila/nx-\* components remain.

## 5-day modernization plan

This repo is mid-way through a planned 5-day upgrade. Day 1 (foundation) is complete.  
Upcoming days are described in `plan.md` at the repo root:

- **Day 2** — Architecture: `core/`, `data/`, `features/` layout, signal store, DTO/domain split, typed mapper
- **Day 3** — Features: URL-synced state, search, detail route, favorites, skeleton/error states, `NgOptimizedImage`
- **Day 4** — Quality: Vitest migration, coverage, a11y, Lighthouse CI, virtual scroll, route preloading
- **Day 5** — Ship: SSR + hydration, PWA, Storybook, deploy (Vercel/Cloudflare), ADRs, README v2
