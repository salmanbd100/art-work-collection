# 0002 — Standalone components everywhere

**Status:** Accepted — 2026-05-13

## Context

The project started on Angular 13 with NgModules. By Angular 19
standalone became the default; modules became optional friction.
Standalone components import their own dependencies, lazy-load via
`loadComponent`, and bootstrap via `bootstrapApplication` without an
`AppModule`.

The repository has one feature module and a small shell. There is no
domain reason to keep modules — they were the old convention, not a
boundary the app needed.

## Decision

Delete every `*.module.ts` during Day 1. Bootstrap with
`bootstrapApplication(RootDefaultComponent, appConfig)`. Define routes
in `app.routes.ts` and lazy-load each route via `loadComponent`.
Providers live in `app.config.ts`.

## Consequences

Smaller bundles (no module wrapper code), simpler mental model, and
zero indirection between a component and its dependencies.
Trade-off: shared imports must be re-listed on every component. For
this app's size that cost is negligible; for a large monorepo we
would revisit with shared barrel components.
