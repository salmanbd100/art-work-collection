# 0005 — SSR + hydration with HTTP transfer cache

**Status:** Accepted — 2026-05-20

## Context

A client-only SPA pays for an empty shell render plus a roundtrip to
the AIC API before the user sees any content. Server-side rendering
fixes that — but a naive SSR setup refetches the same data on the
client during hydration, doubling network cost and flashing the UI.

Angular 21 ships `provideClientHydration`, `withEventReplay`, and
`withHttpTransferCacheOptions`. The transfer cache embeds the
server's HTTP GET responses into the HTML payload so the client
reuses them on hydration instead of refetching.

## Decision

Add `@angular/ssr` with the default Express + CommonEngine setup.
Wire `provideClientHydration(withEventReplay(), withHttpTransferCacheOptions(...))`
in `app.config.ts`. The store's `rxResource` and the API service
need no changes — the cache works transparently against the same
GET URLs.

## Consequences

First paint is HTML with content, not a spinner. The initial
artworks GET doesn't refire on hydration. View source shows artwork
titles, which is useful for SEO and link previews.
Trade-off: SSR doubles the deployment surface (Node server + static
assets) and adds a ~5 KB state payload in HTML. For a portfolio app
on a free serverless tier, this is acceptable.
