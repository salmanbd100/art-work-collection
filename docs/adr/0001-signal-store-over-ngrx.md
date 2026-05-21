# 0001 — Signal store over NgRx

**Status:** Accepted — 2026-05-13

## Context

The app has a single feature (artworks) with five inputs (query, sort,
styles, page, perPage) and a handful of derived views (filtered list,
style facets, totals). State lives behind one HTTP call. There is one
writer (the user) and one reader (the list page).

NgRx adds reducers, actions, effects, selectors, and a devtools wire
for state shapes this small. The actions-as-events ceremony only pays
off when many features share state or when time-travel matters.

## Decision

Use Angular 21 signals with a single `@Injectable({ providedIn: 'root' })`
store. `rxResource` derives the artwork list from input signals;
`computed` derives filtered views and facets; methods like `setQuery`
and `toggleStyle` mutate the inputs.

## Consequences

Less boilerplate, sync-by-default reads, and zero subscribe management.
Trade-off: no time-travel devtools and no library-level conventions
for newcomers. If the app grows past three independent features
sharing state, revisit this decision and consider NgRx Signals.
