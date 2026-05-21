# 0004 — URL as the source of truth for view state

**Status:** Accepted — 2026-05-16

## Context

Browsable list views have several pieces of view-state: search query,
sort, style filters, page, and view-density. Users expect refresh,
back, forward, and sharing to "just work" — which means the URL has
to encode the view.

Without that, every interaction silently invalidates the page state
and links shared in chat or email don't reproduce what the sender
saw.

## Decision

Five query params drive the artworks list: `q`, `sort`, `style`
(comma-separated), `page`, `perPage`. A small `core/url-sync.ts`
helper does the bidirectional translation, and the store wires up
two effects: one reads on init, one writes whenever inputs change
(with `replaceUrl: true` so URL writes don't clutter history).

Search debounce lives in the input component, not the store, so
typing doesn't spam the URL while still keeping the navigation as
the single trigger for refetch.

## Consequences

Refresh, back/forward, and link-sharing all work. The URL doubles
as cheap analytics for popular searches.
Trade-off: filters that don't serialize well (e.g. complex range
queries) would force a heavier scheme like base64 JSON. We don't
need that today.
