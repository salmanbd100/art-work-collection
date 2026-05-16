# 5-Day Plan — Modernizing `art-work-collection`

> A staff-level rewrite of an Angular 13 portfolio project into a modern, architecturally opinionated showcase. Each day ships an independent, demoable improvement. The Claude Code prompt at the end of every day is what you paste into a fresh session to execute that day's work.

## What the project is today

A small Angular 13 SPA that calls the Art Institute of Chicago public API (`/artworks`) and renders a paginated grid of artwork cards with style-filter and sort (Name / Artist / Date). Uses `@aposin/ng-aquila` UI kit. NgModules-based. Everything is in components. No state layer, no typing discipline, no tests of note, no a11y, no SSR, no deploy.

## Current weak points (the "before" picture)

| Area          | Problem                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**     | Angular 13 (3 majors behind), NgModules-only, moment.js, unused deps (`iban`, `i18n-iso-countries`)                                               |
| **Types**     | `any` and `@ts-ignore` everywhere; DTO and domain types are the same shape                                                                        |
| **State**     | All state lives in one component; manual `subscribe`, no async-pipe, no signals                                                                   |
| **Data flow** | Service returns raw API shape; component maps, sorts, filters, paginates — all in one method                                                      |
| **Bugs**      | `_formatArtWorkLocation` has two identical `startDate === endDate` branches; sort breaks when fields are missing; filter loses pagination context |
| **UX**        | No URL-synced state, no detail view, no search, no favorites, no skeletons, no error UI                                                           |
| **Perf**      | No `NgOptimizedImage`, no lazy images, no virtual scroll, no route preloading, no budgets                                                         |
| **Quality**   | No ESLint, no Prettier, no Husky, no CI, minimal tests, no a11y audit, no Lighthouse pass                                                         |
| **Ops**       | No SSR, no PWA, no deploy, no Storybook, README is the CLI default                                                                                |

## The architecture story I want this to tell

By Day 5, the codebase should read as a deliberate layered application:

```
src/app/
├── core/                 ← cross-cutting: HTTP interceptors, error handling, config, signal stores root
├── shared/               ← UI primitives (presentational only — no DI on data)
├── data/
│   └── artworks/
│       ├── artworks.api.ts        ← HTTP layer, DTOs
│       ├── artworks.mapper.ts     ← DTO → domain
│       └── artworks.types.ts      ← Domain types only
├── features/
│   └── artworks/
│       ├── state/                 ← signal store: filters, sort, page, favorites, derived selectors
│       ├── list/                  ← grid page, URL <-> state sync
│       ├── detail/                ← single artwork route + view transition
│       └── favorites/             ← favorites route, persisted via localStorage
└── app.routes.ts         ← standalone, lazy, with preloading
```

Concrete reviewer talking points by the end:

- Standalone components + `provideRouter` + functional interceptors (modern Angular)
- Signal-based store with `computed` derived state and `effect` for persistence — no NgRx ceremony for this size
- DTO/domain split with an explicit mapper (defends against API drift)
- URL is the source of truth for `q`, `sort`, `style`, `page` (deep-linkable, shareable)
- a11y (keyboard, focus, aria, reduced-motion) and Lighthouse ≥ 95 on every category
- SSR + hydration, PWA with offline image cache, Storybook, CI on every push

---

# Day 1 — Foundation: Angular & package upgrade (13 → 21)

**Theme:** Drag the toolchain from 2022 to 2026. The project is on **Angular 13.2** today (released Feb 2022). The current stable is **Angular 21**. That is **8 major versions** of jump. Nothing else this week works if this day is rushed — every later feature (signals, control flow, `rxResource`, hydration, view transitions, deferrable views, standalone-by-default) is gated on getting here cleanly.

> `ng update` only allows **one major at a time**. You will run it eight times, in order, building and committing between each. Do not skip versions or try to do them in parallel.

### Version targets

| Layer                  | From      | To                           | Notes                                                                                                                                                |
| ---------------------- | --------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular                | 13.2      | **21.x** (latest stable)     | Step through every major                                                                                                                             |
| Angular CDK / Material | 13.0      | 21.x                         | Tracks Angular                                                                                                                                       |
| `@aposin/ng-aquila`    | 13.4      | **remove**                   | Latest aquila tracks Angular but only to ~v16/17 reliably. Replace with **Angular Material 21** to get an actively maintained, modern design system. |
| Node.js                | local     | **22 LTS** (or 20.19+)       | Required from Angular 19+                                                                                                                            |
| TypeScript             | 4.5       | **5.9+**                     | Each Angular major bumps the supported TS range                                                                                                      |
| RxJS                   | 7.5       | **7.8**                      | Angular 19+ requires 7.8                                                                                                                             |
| Zone.js                | 0.11      | **0.15** (or drop, zoneless) | Decide on Day 1 prompt — default keeps zone, future-friendly is zoneless                                                                             |
| Jasmine / Karma        | 4.x / 6.x | TBD Day 4 (Vitest migration) | Leave as-is today                                                                                                                                    |

### What changes at each Angular major (the cheat sheet)

| Major       | Headline changes that affect this project                                                                                                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **13 → 14** | Typed forms (we have none — easy). `ng completion`. Standalone components introduced as developer preview. `Title` service auto-imported.                                                                                                                                        |
| **14 → 15** | Standalone components become **stable**. Image directive (`NgOptimizedImage`) added. Functional router guards. MDC-based Material (visual diff; review every Material/Aquila component if you keep one). Node 14 dropped.                                                        |
| **15 → 16** | **Signals preview**. Required `@Input`s. `takeUntilDestroyed`. Esbuild-based dev server. Server-side rendering rewritten. Node 14/16 dropped. TS 4.9+.                                                                                                                           |
| **16 → 17** | **Stable signals**. New control flow `@if/@for/@switch` (codemod available — run it). Deferrable views (`@defer`). Application builder (esbuild) becomes default. New project structure (`app.config.ts`, no `AppModule`). View transitions API. New logo / docs at angular.dev. |
| **17 → 18** | **Zoneless** change detection preview. `provideExperimentalZonelessChangeDetection()`. Material 3. Event replay during hydration. `effect` rules tightened.                                                                                                                      |
| **18 → 19** | **Standalone is the default** (`standalone: true` is implicit; the schematic now generates non-standalone with an explicit flag). Linked signals + `resource()`/`rxResource()` APIs land as preview. Incremental hydration preview. TS 5.5+. `@let` in templates.                |
| **19 → 20** | Resource / linked signal APIs stable. Zoneless stable (still opt-in). Material 3 polish. Stricter typings around DI.                                                                                                                                                             |
| **20 → 21** | Latest stable — polish, perf, sundry cleanup. Verify your code against the v21 release notes for any newly-flagged deprecations.                                                                                                                                                 |

### Outcomes (end of Day 1) ✅

> **What actually shipped (2026-05-13):** Angular 13.2 → 21.2 in 8 sequential major-version commits. ng-aquila replaced with Angular Material 21 (M3 theme). All NgModules deleted — fully standalone with `bootstrapApplication`. New `@if`/`@for` control flow via v21 codemod. Zero `@ts-ignore`, zero `any` (non-test). strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes all on. ESLint (angular-eslint v21, flat config) + Prettier + Husky + lint-staged wired up with pre-commit hook. CI baseline (lint + typecheck + build) on push/PR. All inject() function DI. pnpm 9, Node 22.

- App is on **Angular 21**, builds clean, `ng serve` opens the same UI as before (no behavior regressions).
- **All NgModules deleted.** Every component is standalone. Bootstrap is `bootstrapApplication(RootComponent, appConfig)`; `appConfig` provides `provideRouter`, `provideHttpClient(withFetch(), withInterceptors([]))`, `provideAnimationsAsync()`.
- Templates use new control flow (`@if`, `@for`, `@switch`) — `*ngIf`/`*ngFor` removed (Angular ships a migration: `ng generate @angular/core:control-flow`).
- **`@aposin/ng-aquila` removed** and replaced with Angular Material 21 components (formfield, select, paginator, progress-spinner, card, grid via CDK layout / CSS grid).
- **TypeScript strict + Angular strict templates** on. Zero `@ts-ignore`. Real types replacing `any`.
- **Unused deps gone:** `iban`, `i18n-iso-countries`, `moment`.
- **pnpm** is the package manager; `package-lock.json` deleted; `.npmrc` set to `engine-strict=true`.
- **Node engine pinned** in `package.json` (`"engines": { "node": ">=20.19" }`).
- **ESLint (angular-eslint v21) + Prettier + Husky + lint-staged** wired up. `pnpm lint`, `pnpm format`, pre-commit blocks bad commits.
- **`.nvmrc`** pins Node 22.
- **CI baseline**: stub `.github/workflows/ci.yml` runs install + lint + build on push (the full CI lands Day 4).
- **README** updated with the new stack table and an "Upgrade journey" section listing the 8 commits.

### Files touched / created

- Modify (heavily): `package.json`, `pnpm-lock.yaml`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, `src/main.ts`, `src/index.html`, `src/styles.scss`, `src/environments/*`, every `*.component.ts/html/scss`
- Delete: `src/app/app-root/app-root.module.ts`, `src/app/app-root/app-root-routing.module.ts`, `src/app/app-art-work/app-art-work.module.ts`, `src/app/app-art-work/app-art-work-routing.module.ts`, `src/app/app-shared/art-work-card/art-work-card.module.ts`, `package-lock.json`
- Create: `src/app/app.config.ts`, `src/app/app.routes.ts`, `.eslintrc.json` (or `eslint.config.js` for flat config), `.prettierrc`, `.prettierignore`, `.husky/pre-commit`, `lint-staged.config.mjs`, `.nvmrc`, `.npmrc`, `.github/workflows/ci.yml`

### Acceptance

- `node --version` ≥ 20.19; `pnpm --version` works.
- `pnpm install` is clean (no peer warnings of consequence).
- `pnpm build` → success, no deprecation warnings from `@angular/*`.
- `pnpm start` → opens `http://localhost:4200/`, same grid renders, same pagination/sort/filter behavior.
- `grep -rn "@NgModule" src` → 0 hits.
- `grep -rn "@ts-ignore" src` → 0 hits.
- `grep -rn "\*ngIf\|\*ngFor\|\*ngSwitch" src` → 0 hits.
- `grep -rn "from \"moment\"\|from 'moment'" src` → 0 hits.
- `git log --oneline | head -20` shows one commit per Angular major (named `chore(deps): upgrade angular to vNN`) plus the supporting commits.

### Claude Code prompt — paste this on Day 1

````
We are modernizing an Angular 13.2 project to Angular 21. Today is Day 1 of a 5-day plan in plan.md. Read plan.md fully first, especially the Day 1 "version targets" and "cheat sheet" tables.

This day is mechanical and disciplined. Do NOT touch product logic. Behavior parity at end of day. Commit between every step.

PRE-FLIGHT (do these first, one commit each)
A. Verify Node is 20.19+ (ideally 22 LTS). If not, stop and tell me to install it. Create `.nvmrc` with `22`.
B. Switch to pnpm: delete `package-lock.json`, run `pnpm install` against the existing `pnpm-lock.yaml`, confirm `pnpm build` still works on Angular 13. Add `"engines": { "node": ">=20.19" }` and `"packageManager": "pnpm@<current>"` to package.json. Create `.npmrc` with `engine-strict=true`.
C. Remove unused deps NOW (safer to do before upgrading them): `pnpm remove iban i18n-iso-countries moment`. Confirm `grep -r "moment\|iban\|i18n-iso-countries" src` is clean — if it isn't, replace usages with `date-fns` or `Intl` before removing.

ANGULAR UPGRADE LOOP — run once per major, 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21.
For each step N → N+1:
  1. `pnpm exec ng update @angular/core@<N+1> @angular/cli@<N+1>` (and Material/CDK at the same major if still installed at this point).
  2. Read the migration output. If it mentions schematics or codemods you should run, run them. Common ones to expect:
       - v17: `ng generate @angular/core:control-flow` (after we're on v17)
       - v17: `ng generate @angular/core:standalone` (we'll also do standalone manually, but the codemod is fine)
       - v18+: nothing crucial for this project — read and decide.
  3. `pnpm build`. Fix every error. Common breakages by version:
       - v15: MDC-based Material classes change. Aquila will start to creak — see step "AQUILA SWAP" below; you may need to do that swap mid-upgrade rather than at the end.
       - v15: removed `ViewEngine` artifacts; remove anything in tsconfig like `"enableIvy": false`.
       - v16: `Router.events` typing tightens; fix any `any` filters.
       - v17: new `app.config.ts` pattern. We'll convert to that during STANDALONE MIGRATION below — it's fine to keep AppModule alive until v17 lands.
       - v19: standalone is default. Any remaining modules become explicit `standalone: false`. We will delete them anyway.
  4. `pnpm start`, click through the app, confirm it renders.
  5. Commit: `chore(deps): upgrade angular to v<N+1>`.

AQUILA SWAP — do this **before** the v17 step (Aquila's last reliable Angular support is around v16 — verify on their npm page; if their current package supports v21, keep it and skip this section).
  1. Add Angular Material: `pnpm exec ng add @angular/material@<current angular major>`. Pick an indigo/pink prebuilt theme to start; we'll theme on Day 5.
  2. Replace Aquila components used in `art-work-list.component.html` and `art-work-card.component.html`:
       - `nxLayout="grid"` / `nxRow` / `nxCol` → CSS grid utility classes (no Material module needed for layout).
       - `nx-formfield` + `nx-multi-select` → `mat-form-field` + `mat-select` with `multiple`.
       - `nx-dropdown` → `mat-select`.
       - `nx-pagination` → `mat-paginator`.
       - `nx-spinner` → `mat-progress-spinner`.
       - `nx-card`, `nx-card-header` → `mat-card`, `mat-card-header`.
  3. Remove `@aposin/ng-aquila` from package.json. Confirm `grep -rn "ng-aquila\|nx-" src` is clean.
  4. Build, run, eyeball the UI. The visuals will differ — that's expected and Day 5 will polish them.
  5. Commit: `refactor(ui): replace ng-aquila with angular material`.

STANDALONE MIGRATION — do this **after** the v17 step (where the modern pattern is supported), and refine after v19 (where it's default).
  1. Run `pnpm exec ng generate @angular/core:standalone` and walk through its three modes (convert components, convert routes, remove unnecessary modules). Verify behavior between each.
  2. Manually create/finish `src/app/app.config.ts`:
       ```ts
       export const appConfig: ApplicationConfig = {
         providers: [
           provideRouter(routes, withViewTransitions()),
           provideHttpClient(withFetch()),
           provideAnimationsAsync(),
         ],
       };
       ```
  3. Manually create `src/app/app.routes.ts` matching the existing route tree.
  4. Replace `src/main.ts` body with `bootstrapApplication(RootComponent, appConfig)`.
  5. Delete every `*.module.ts` and any orphan `*-routing.module.ts`. Run a `grep -rn "@NgModule\|NgModule" src` — must be 0 hits.
  6. Convert templates to new control flow: `pnpm exec ng generate @angular/core:control-flow`. Then `grep -rn "\*ngIf\|\*ngFor\|\*ngSwitch" src` must be 0.
  7. Commit (can be 2-3 commits): `refactor(app): bootstrap standalone, delete modules, adopt new control flow`.

STRICTNESS & LINT
  1. In `tsconfig.json` set `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`, `"exactOptionalPropertyTypes": true`. In `angular.json` set `"strictTemplates": true` and `"strictInjectionParameters": true` under `angularCompilerOptions`.
  2. `pnpm build` and fix every error. Replace `any` with real types — declare interfaces in the files that need them. Remove every `@ts-ignore`. (The big offenders are `art-work-list.component.ts` and `sort-utility.service.ts`. Fix them in place — proper refactor is Day 2.)
  3. Commit: `chore(ts): enable strict typescript + strict templates`.

LINT / FORMAT / HOOKS
  1. `pnpm exec ng add @angular-eslint/schematics`. Choose flat config (eslint.config.js).
  2. Install Prettier + the angular plugin: `pnpm add -D prettier prettier-eslint eslint-config-prettier`. Add `.prettierrc` with `{ "singleQuote": true, "trailingComma": "all", "printWidth": 100 }` and `.prettierignore` (pnpm-lock.yaml, dist, .angular, coverage).
  3. Install husky + lint-staged: `pnpm add -D husky lint-staged && pnpm exec husky init`. Add `.husky/pre-commit` running `pnpm exec lint-staged`. Create `lint-staged.config.mjs` that runs `eslint --fix` on `*.ts`, `*.html` and `prettier --write` on `*.{ts,html,scss,md,json}`.
  4. Add scripts to package.json: `"lint": "ng lint"`, `"lint:fix": "ng lint --fix"`, `"format": "prettier --write ."`, `"format:check": "prettier --check ."`, `"typecheck": "tsc --noEmit"`.
  5. `pnpm lint && pnpm format:check && pnpm build` all green. Commit: `chore(dev): eslint + prettier + husky + lint-staged`.

CI BASELINE
  1. Create `.github/workflows/ci.yml`: triggers on `push` and `pull_request`. Single job, Node 22, pnpm setup-node action, steps: install / lint / typecheck / build. Use the actions cache for pnpm store.
  2. Commit: `ci: baseline pipeline (lint + typecheck + build)`.

README
  1. Update README.md with: project pitch (one sentence), stack table (Angular 21, Material 21, RxJS 7.8, TS 5.9, Node 22, pnpm), scripts table, "Upgrade journey" section listing the 8 Angular commits. Leave the architecture diagram for Day 2.
  2. Commit: `docs: refresh README for v21 stack`.

GLOBAL RULES (apply to every step)
- One commit per numbered step. Conventional Commits.
- After every commit: `pnpm build`. Red build = stop and fix before the next step.
- Do not touch product logic (no refactors of art-work-list/state/services beyond what's required to satisfy strict types). The proper architecture refactor is Day 2.
- If `ng update` reports a blocking peer dependency conflict you cannot resolve in 15 minutes, stop and tell me — do not pin around it.
- If at any point the in-browser behavior differs from before, stop and fix before moving on.
````

---

# Day 2 — Architecture: layered data flow, signal store, typed domain

**Theme:** Show that you think about architecture, not just features. Today is the day a senior reviewer says "okay, this person has done this before."

### Outcomes ✅

> **What actually shipped (2026-05-13):** Folder layout created (`core/`, `data/`, `features/`, `shared/`). DTO/domain split: `artworks.dto.ts`, `artworks.types.ts`, `artworks.mapper.ts` (with `formatLocation` bug fixed), `artworks.mapper.spec.ts`, `artworks.api.ts`. Three functional HTTP interceptors (base-url, error, loading) + `loading.signal.ts` wired into `app.config.ts`. Signal-based `ArtworksStore` using `rxResource` (note: Angular 21 uses `params`/`stream` not `request`/`loader`). `ArtworksListPage` and `ArtWorkCardComponent` rewritten as OnPush presentational shells with signal inputs — zero `subscribe()`, zero `any`. Old services/interfaces/components deleted. `pnpm build` clean; grep confirms 0 subscribes, 0 anys.

- Folder structure reshaped into `core/`, `shared/`, `data/`, `features/` (see top of plan).
- **DTO / domain split:** `data/artworks/artworks.dto.ts` mirrors the AIC API exactly. `data/artworks/artworks.types.ts` defines the domain `Artwork` and `Pagination`. `artworks.mapper.ts` translates DTO → domain and is the _only_ place that knows about `image_id`, `style_titles`, `iiif_url`, etc.
- **`ArtworksApi`** service exposes a typed `list({ page, perPage, query, sort })` returning `Observable<Page<Artwork>>` — no `any`.
- **`ArtworksStore`** (signal-based, `@Injectable({ providedIn: 'root' })`) holds:
  - inputs: `query`, `sort`, `styleFilters`, `page`, `perPage`
  - resource: `artworks` (use `rxResource` / `resource` — stable in Angular 20+, which we're on)
  - derived: `filteredArtworks` (`computed`), `styleFacets` (`computed`), `totalPages` (`computed`)
- **Functional HTTP interceptors** for: base URL, error normalization (`HttpError` type), and a loading-counter signal exposed by `core/loading.signal.ts`.
- The list component drops to a _presentational_ shell that reads from the store and dispatches user intents — no `subscribe`, no mapping, no sorting logic in the component.

### Files touched / created

- Create: `src/app/core/http/base-url.interceptor.ts`, `src/app/core/http/error.interceptor.ts`, `src/app/core/http/loading.interceptor.ts`, `src/app/core/loading.signal.ts`, `src/app/data/artworks/artworks.dto.ts`, `src/app/data/artworks/artworks.mapper.ts`, `src/app/data/artworks/artworks.types.ts`, `src/app/data/artworks/artworks.api.ts`, `src/app/features/artworks/state/artworks.store.ts`
- Move/refactor: `art-work-list.component.ts` → `src/app/features/artworks/list/artworks-list.page.ts` (rename to follow `*.page.ts` for routed components, `*.component.ts` for reusable)
- Delete: `app-art-work/services/art-work.service.ts`, `app-art-work/services/sort-utility.service.ts` (logic moves into the store/mapper)
- Modify: route definitions, all imports

### Acceptance

- `ArtworksStore` has unit tests covering: filter intent, sort intent, pagination intent, derived `filteredArtworks`, derived `styleFacets`.
- `artworks.mapper.spec.ts` covers the DTO → domain mapping including null/missing fields (the current `_formatArtWorkLocation` bug — duplicate condition — must die here, with a regression test).
- No `subscribe(` calls remain in any component template file or `.ts` file — verify with grep.
- `grep -r ": any" src` returns 0 (or only in tests where unavoidable).
- The app behaves identically to Day 1 from the user's perspective. This is pure refactor.

### Claude Code prompt — paste this on Day 2

```
Day 2 of plan.md. Read Day 2 section fully first. Do not start Day 3.

This is a pure architecture refactor — the user-visible behavior MUST NOT change today.

1. Create the folder layout described in plan.md ("the architecture story"): core/, shared/, data/, features/. Move existing files into their new homes. Update all imports. Commit.

2. In `src/app/data/artworks/`:
   - `artworks.dto.ts`: type the AIC API response exactly (image_id, style_titles, place_of_origin, date_start, date_end, material_titles, artist_title, title, id, pagination block, config block with iiif_url). Inspect a real response if needed.
   - `artworks.types.ts`: domain types — `Artwork`, `Page<T>`, `ArtworkSort` ('name' | 'artist' | 'date'), `ArtworkFilters`.
   - `artworks.mapper.ts`: `toArtwork(dto): Artwork` and `toPage(response): Page<Artwork>`. Fix the duplicate-condition location-formatting bug from the original code. Add a unit test file covering missing-field cases.
   - `artworks.api.ts`: `list(input: { page; perPage; query?; sort? }): Observable<Page<Artwork>>`. No `any`. Use the mapper.
   Commit.

3. In `src/app/core/http/`:
   - `base-url.interceptor.ts` functional interceptor that prepends `environment.artWork` only for relative URLs.
   - `error.interceptor.ts` functional interceptor that normalizes errors into a typed `HttpError` { status, message, cause } and rethrows via `throwError`.
   - `loading.interceptor.ts` functional interceptor that increments/decrements a signal in `core/loading.signal.ts`.
   Register all three in `main.ts` via `provideHttpClient(withInterceptors([...]))`.
   Commit.

4. In `src/app/features/artworks/state/artworks.store.ts`:
   - Signal-based store, `providedIn: 'root'`.
   - Writable signals: `query`, `sort`, `styleFilters`, `page`, `perPage`.
   - Use Angular 21's `rxResource` (or `resource`) to derive `artworksResource` from those inputs. If the resource API behavior is unfamiliar to you, check the Angular docs via context7 before guessing.
   - `computed`: `artworks`, `styleFacets`, `totalPages`, `isLoading`, `error`.
   - Methods: `setQuery`, `setSort`, `toggleStyle`, `clearStyles`, `nextPage`, `prevPage`, `goToPage`.
   - Sorting and style filtering happen here, not in components. Re-implement them in pure functions exported from the same folder so they are unit-testable.
   Write unit tests for the store covering each method and derived signal.
   Commit.

5. Rewrite `art-work-list.component` as `features/artworks/list/artworks-list.page.ts`:
   - Standalone, OnPush, signals-only.
   - Template uses `@if`, `@for`, no NgIf/NgFor.
   - No `subscribe`. No mapping. No sorting logic. Just reads store signals and calls store methods.
   - Same for `art-work-card.component` — make it pure presentational with typed `@Input() artwork: Artwork` and `@Input() iiifBaseUrl: string`. Use `input()` signal inputs.
   Commit.

6. Delete the old `services/art-work.service.ts`, `services/sort-utility.service.ts`, `services/art-work-card.service.ts`, and any module files left behind. Update routes. Run the app and verify behavior parity manually. Commit.

Rules:
- Behavior parity is the bar. If you see UX improvements you want to make, write them in plan.md as Day 3 candidates and move on.
- `grep -r "subscribe(" src/app` should return 0 hits in components by end of day.
- `grep -rn ": any" src/app` should return 0 hits.
- Commit after each numbered step.
```

---

# Day 3 — Features: UX that demonstrates product sense

**Theme:** Architecture without features is a museum piece. Today shows you can build things users actually want, on top of the structure from Day 2.

### Outcomes ✅

> **What actually shipped (2026-05-16):** URL sync (`core/url-sync.ts` + `store.syncFromUrl()`), debounced search (`SearchInputComponent` 300ms), `/artworks/:id` detail route with view-transition image cross-fade, `FavoritesStore` (localStorage persistence) + `/favorites` route, skeleton/empty/error states, `NgOptimizedImage` on cards. Follow-up commit fixed six bugs: double debounce removed (debounce lives in search component only), `selectedStyles` local array replaced with `store.styleFilters()` binding, search input now initializes from `[value]="store.query()"` via signal effect, `setPage`/`setPerPage` no longer clear styles, sort select bound to store via `[ngModel]="store.sort()"`, added "None" sort option to allow reset.

### Features to ship

1. **URL-synced state.** Query string is the single source of truth: `?q=monet&sort=date&style=Impressionism&page=2`. Refresh keeps state; back/forward works. Use `Router` + `ActivatedRoute` + a small adapter in the store (`syncFromUrl()` / `effect` writes to URL).
2. **Debounced search.** Top-bar input. Debounce 300 ms via `toSignal(fromEvent(...).pipe(debounceTime(300)))` or `rxjs-interop`. Search by `title,artist_title` using the AIC `/search` endpoint (if needed swap the API call inside `ArtworksApi`).
3. **Artwork detail route.** `/artworks/:id` — fetches a single artwork (use `inject(ArtworksApi)` in a route resolver or `rxResource` keyed off the param). View Transitions API for the image (the `withViewTransitions()` router feature).
4. **Favorites.** Heart icon on the card. Click toggles. Favorites persisted via `effect()` writing a signal to `localStorage`. `/favorites` route shows them. Empty state with a CTA.
5. **States UI.** Skeleton grid (8 cards) while loading. Empty result state. Error state with retry. All wired to the store's `isLoading` / `error` / `artworks().length === 0`.
6. **Optimized images.** `NgOptimizedImage` with `priority` for above-the-fold, `loading="lazy"` below, explicit width/height to avoid CLS, fallback to default image on error.

### Files touched / created

- Create: `features/artworks/list/search-input.component.ts`, `features/artworks/list/skeleton-card.component.ts`, `features/artworks/list/empty-state.component.ts`, `features/artworks/list/error-state.component.ts`, `features/artworks/detail/artwork-detail.page.ts`, `features/artworks/favorites/favorites.page.ts`, `features/artworks/state/favorites.store.ts`, `core/url-sync.ts`
- Modify: `app.routes.ts`, `artworks.store.ts` (URL sync hooks), `artworks-list.page.ts` (consume new sub-components), `art-work-card.component` (favorite toggle, `NgOptimizedImage`)

### Acceptance

- Opening `/?q=monet&sort=artist&style=Impressionism&page=2` reproduces that exact view.
- Typing in search updates URL after 300 ms idle.
- Favoriting an artwork on `/` and refreshing keeps the heart filled.
- Clicking a card transitions to `/artworks/:id` with a smooth image cross-fade (Chrome).
- Lighthouse "Best Practices" and "Accessibility" both ≥ 95 (informal check today, formal pass tomorrow).
- Disconnecting the network shows the error state with a working retry button.

### Claude Code prompt — paste this on Day 3

```
Day 3 of plan.md. Read the Day 3 section first. Do not start Day 4.

Build six features, in this order, committing each independently:

1. URL-synced state. Add a `core/url-sync.ts` helper that reads `q`, `sort`, `style` (comma-separated), `page`, `perPage` from ActivatedRoute and writes them back via Router.navigate with `queryParamsHandling: 'merge'` and `replaceUrl: true`. Wire it into `ArtworksStore` via two effects: one reading on init, one writing whenever inputs change. Reloading the page must restore state.

2. Debounced search. Add `SearchInputComponent` with a typed signal input/output. In the store, debounce `query` writes by 300ms before triggering a refetch (use rxjs interop `toObservable(querySignal).pipe(debounceTime(300))` then `toSignal`). If the AIC `/artworks` endpoint does not support full-text search, switch the API call to `/artworks/search?q=...&fields=...` and update the DTO/mapper as needed. Verify against the real API before committing.

3. Artwork detail route. Add `/artworks/:id` route, lazy-loaded, standalone. `ArtworkDetailPage` consumes a resolver or `rxResource` keyed off the route param. Enable view transitions via `withViewTransitions()` in `provideRouter`. The card image and the detail image share a `view-transition-name` so the image animates between routes.

4. Favorites. Add `FavoritesStore` (signal store) with `favorites: Signal<Set<string>>`, `toggle(id)`, `has(id)`. Persist via `effect()` to localStorage under key `awc.favorites.v1`. Add a heart button to the card. Add `/favorites` route showing the favorited artworks (fetch by id batch or filter client-side from a cache — simplest correct choice).

5. States UI. Build `SkeletonCardComponent` (CSS-only shimmer), `EmptyStateComponent`, `ErrorStateComponent`. In `ArtworksListPage` use the store's `isLoading`, `error`, and `artworks().length` to drive which one shows. Error state has a Retry button that calls `store.retry()` (add this method).

6. Optimized images. Switch `<img>` to `NgOptimizedImage` everywhere artworks display. Provide explicit width/height. The first row of the grid gets `priority`. Keep the on-error fallback to the default image. Add `<link rel="preconnect">` for the IIIF host in index.html.

Rules:
- Verify the URL-sync after every feature: refresh = same view. If favorites/search break URL sync, fix immediately.
- Each numbered step is its own commit.
- Use Angular control flow (@if, @for, @switch) everywhere. No NgIf/NgFor.
- Test in the browser before claiming each step done. Type-checks alone don't prove UX works.
```

---

# Day 4 — Quality: tests, a11y, performance budgets

**Theme:** Make the codebase boring to maintain. Reviewers love this; juniors skip it.

### Outcomes ✅

> **What actually shipped (2026-05-16):** Karma → Vitest migration via @analogjs/vitest-angular 2.5.1 + @analogjs/vite-plugin-angular 2.5.1 — all 26 existing specs ran as-is in ~2s. New specs: artworks.api.spec.ts (list/getById with HttpTestingController + firstValueFrom), favorites.store.spec.ts (toggle/has/localStorage/TestBed.flushEffects), search-input.component.spec.ts, error-state.component.spec.ts (via @testing-library/angular + userEvent). Coverage: data/ at 100%, features/\*/state/ at ~83% (targets met). a11y: `<header>/<nav>/<main>` landmarks on all 3 routes, :focus-visible outline, prefers-reduced-motion disables view transitions. Bundle budgets set (400kB warn / 500kB error raw; gzipped initial is 124kB well under plan targets). Virtual scroll dense mode behind ?dense=1 URL param (CDK cdk-virtual-scroll-viewport, perPage 60). HoverPreloadStrategy + DetailPreloader preload artworks/:id chunk on card mouseenter/focusin. CI updated with coverage step + lhci.yml workflow with .lighthouserc.json assertions. typecheck script scoped to tsconfig.app.json.

- **Migrate test runner from Karma to Vitest** (`@analogjs/vitest-angular`) — or stay on Karma if migration risk is too high; pick one in the first step.
- **Test coverage targets:** 90% for `data/`, 80% for `features/*/state/`, smoke tests for routed pages.
- **Component testing with Angular Testing Library**: keyboard-driven test for search input, screen-reader-label test for favorite button.
- **a11y pass:**
  - All interactive elements reachable by keyboard, visible focus rings.
  - Card → detail link has descriptive accessible name (artwork title + artist, not "click here").
  - `prefers-reduced-motion` disables view transitions.
  - Color contrast ≥ 4.5:1 (run `axe` via Playwright or DevTools).
  - Page has one `<h1>`; landmark regions (`<header>`, `<main>`, `<nav>`).
- **Performance budgets** in `angular.json`: main bundle < 250 KB gz, initial < 400 KB gz.
- **Lighthouse CI** in GitHub Actions — fails build if Perf/A11y/Best-Practices/SEO < 95.
- **Virtual scroll variant** of the grid behind a toggle, using `@angular/cdk/scrolling` — useful when `perPage` is bumped to 60+.
- **Route preloading strategy**: `PreloadAllModules` or a custom "preload on hover" strategy on the card link.

### Files touched / created

- Create: `vitest.config.ts` (if migrating), `.github/workflows/ci.yml`, `e2e/` (optional Playwright a11y smoke), `features/artworks/list/use-virtual-scroll.signal.ts`
- Modify: `angular.json` budgets, every `*.spec.ts` to match the new runner if migrated, every component for a11y attributes

### Acceptance

- `pnpm test` runs and reports coverage; CI prints the coverage summary.
- `axe` reports zero violations on `/`, `/artworks/:id`, `/favorites`.
- Tabbing through `/` reaches: search → sort → filter → first card link → favorite button → next card link, in that visual order.
- Lighthouse on a production build: Perf ≥ 90 (mobile throttling), A11y ≥ 95, Best-Practices ≥ 95, SEO ≥ 95.
- Build fails locally if you import a 50 KB library into `core/`.

### Claude Code prompt — paste this on Day 4

```
Day 4 of plan.md. Read the Day 4 section first. Do not start Day 5.

1. Decide test runner. Run a 10-minute spike: can `@analogjs/vitest-angular` run the existing specs as-is? If yes, migrate Karma → Vitest, delete `karma.conf.js` and `src/test.ts`. If no, stay on Karma but upgrade it. Commit either way with a clear message stating the choice and reason.

2. Tests. Write/extend tests until coverage hits: data/ ≥ 90%, features/*/state/ ≥ 80%. Add @testing-library/angular component tests for: SearchInput (keyboard typing fires debounced output), favorite button (aria-pressed flips on click), error state (Retry calls store.retry). Commit per file group.

3. a11y pass. Add:
   - Visible focus rings (`:focus-visible` outline).
   - `<main>`, `<header>`, `<nav>` landmarks. Exactly one `<h1>` per route.
   - Accessible names: card link = "View {{title}} by {{artist}}"; favorite = "Add/remove {{title}} from favorites" with `aria-pressed`.
   - `@media (prefers-reduced-motion: reduce)` disables view transitions and shimmer animation.
   - Install `@axe-core/playwright` if doing it programmatically, else run `axe` DevTools manually and fix all violations.
   Commit.

4. Bundle budgets. In angular.json set initial budget to 400 KB warning / 500 KB error, anyComponentStyle 6 KB. Run `pnpm build` and resolve any breaches (likely Aquila or Material — tree-shake or scope imports). Commit.

5. Virtual scroll toggle. Add a `?dense=1` URL param or settings toggle that switches the grid to `cdk-virtual-scroll-viewport` with `perPage` bumped to 60. Keep the existing pagination grid as default. Commit.

6. Route preloading. Implement a custom preload strategy that preloads a route when its link is hovered or focused. Apply to card links. Commit.

7. CI. Add `.github/workflows/ci.yml` running on pull_request and push to main: install (pnpm), lint, typecheck, test with coverage, build. Add a separate `lhci.yml` running Lighthouse CI against `pnpm build && pnpm exec http-server dist/...` and asserting Perf/A11y/BP/SEO ≥ 95/95/95/95. Commit.

Rules:
- If a Lighthouse score won't reach the threshold without losing a feature, lower the threshold in the config AND write a sentence in README/perf-notes.md explaining the tradeoff. Don't silently disable.
- Tests must test behavior, not implementation. No assertions on private signal names.
- Commit after each numbered step.
```

---

# Day 5 — Ship: SSR, PWA, Storybook, deploy, narrative

**Theme:** Wrap a bow on it. By end of day a recruiter can open one link and get the whole story.

### Outcomes

- **Angular SSR + hydration** via `@angular/ssr`. First paint comes from the server, client hydrates without re-fetching the initial page (use `TransferState` for the first artworks page).
- **PWA**: `@angular/pwa` schematic, manifest with name/icons/theme, service worker caches: app shell + 50 most recent IIIF images. Offline route shows favorites (already in localStorage).
- **Storybook 8** with stories for: `ArtWorkCard`, `SearchInput`, `SkeletonCard`, `EmptyState`, `ErrorState`. Stories double as visual regression candidates (Chromatic-ready but not required to subscribe).
- **Deploy**: Vercel or Cloudflare Pages (Angular SSR adapter), one click from PR. Preview URL on every PR via CI.
- **Architecture Decision Records**: `docs/adr/` with 0001-signal-store-over-ngrx.md, 0002-standalone-everywhere.md, 0003-dto-domain-split.md, 0004-url-as-state.md, 0005-ssr-with-transferstate.md. ~150 words each: context, decision, consequences.
- **README v2**: hero image (screenshot/GIF), feature list, architecture diagram (Mermaid), local dev commands, deploy link, "design decisions" linking ADRs, "what I'd do next" section showing future thinking.

### Files touched / created

- Create: `src/server.ts` (or whatever the schematic generates), `ngsw-config.json`, `public/manifest.webmanifest`, `.storybook/`, `stories/*.stories.ts`, `docs/adr/000*.md`, deploy config (`vercel.json` or `wrangler.toml`), screenshot/gif in `docs/`
- Modify: `app.config.ts` (provide SSR / Transfer State), `app.routes.ts` (provideClientHydration), `package.json` (scripts: `dev:ssr`, `serve:ssr`, `storybook`, `build:storybook`), `README.md` (full rewrite), CI to deploy on push to main

### Acceptance

- Disabling JavaScript in DevTools still shows the artworks grid on first load.
- View source on `/` shows artwork titles in HTML.
- After visiting `/` once, going offline and refreshing still shows the previously-loaded page and favorites; navigation to detail pages of cached artworks works.
- Storybook builds and runs locally; at least 5 stories pass interactions.
- Production URL works end-to-end. Tweet-ready.
- Each ADR is ≤ 200 words, written in plain English.
- README's "Architecture" Mermaid diagram renders on GitHub.

### Claude Code prompt — paste this on Day 5

```
Day 5 of plan.md. Final day. Read Day 5 section first.

1. SSR + hydration. Run `ng add @angular/ssr` and accept. Add `provideClientHydration()` (it's likely added by the schematic; verify). Use `TransferState` so the artworks list fetched on the server isn't refetched on the client for the initial route. Verify: with JS disabled, `/` still shows artworks. Commit.

2. PWA. Run `ng add @angular/pwa`. Customize `ngsw-config.json`:
   - App shell: prefetch.
   - IIIF images (host pattern): runtime cache, performance strategy, max 50 entries, 7 days.
   - API: runtime cache, freshness strategy, 10s timeout.
   Update manifest with proper name, theme color, icons (generate from a simple letter "A" logo if you have nothing better). Verify install prompt and offline behavior. Commit.

3. Storybook. Install Storybook 8 for Angular (`npx storybook@latest init`). Write stories for: ArtWorkCard (with/without image, long title, favorited), SearchInput (debounce behavior), SkeletonCard, EmptyState, ErrorState (retry play function). Add a `pnpm storybook` script. Build also produces `storybook-static/`. Commit.

4. ADRs. Write the 5 ADRs in `docs/adr/` listed in plan.md. Use the format: Context, Decision, Consequences. Keep each under 200 words. They should be honest — include the tradeoff that lost the decision. Commit.

5. README rewrite. Replace the Angular-CLI default with:
   - Title + one-line pitch + production link + screenshot/GIF
   - "Features" bullet list (3–5 items)
   - "Architecture" with a Mermaid `flowchart LR` showing UI → store → data → API
   - "Stack" table
   - "Run it" commands
   - "Design decisions" linking each ADR
   - "What I'd do next" — 3 honest bullets about limitations and future improvements
   Commit.

6. Deploy. Pick Vercel (easiest for Angular SSR via the adapter) or Cloudflare Pages. Add the config file, wire the deploy step into CI on push to main, store any required tokens as GitHub secrets (do NOT commit them). Add a PR-preview step. Once deployed, paste the live URL into the README. Commit.

7. Final sweep:
   - Run `pnpm lint && pnpm test && pnpm build` — all green.
   - Run Lighthouse one last time on the deployed URL, paste the four scores into the README.
   - Verify every ADR link in the README resolves.
   - Tag the commit `v1.0.0` and push the tag.

Rules:
- No new features today. If something is broken, fix it; if something is just missing polish, ship without it and add it to "What I'd do next".
- The README is the front door. Re-read it at the end as if you were the recruiter — does it sell the work in 30 seconds?
```

---

## Working agreement (applies every day)

- One commit per numbered step. Conventional Commits (`feat:`, `refactor:`, `chore:`, etc.).
- **Before every commit: show the proposed commit message and ask for permission. Do not commit automatically.**
- Don't move on while the build is red.
- If a step turns out to be wrong, write a one-line note at the bottom of `plan.md` and adjust the next day's prompt before you start it.
- At the end of each day, update the relevant `Outcomes` block in this file with a ✅ and a one-line "what actually shipped" note. This becomes a session log that's useful for the README on Day 5.
