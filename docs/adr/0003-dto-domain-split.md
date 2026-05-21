# 0003 — DTO/domain split with an explicit mapper

**Status:** Accepted — 2026-05-13

## Context

The Art Institute of Chicago API returns artworks with snake_case
fields, optional images, partial dates, and a `config.iiif_url` that
must be combined with `image_id` to form a URL. The original code
leaked these shapes into components — sorting, filtering, and
rendering all touched raw API fields.

If the API changes a field name or shape, every consumer breaks.
The component layer also had no clean place to defend against missing
data or to encode rules like "format location from place_of_origin
plus date_start/date_end".

## Decision

Three files under `data/artworks/`:

- `artworks.dto.ts` — types the API response exactly.
- `artworks.types.ts` — defines the domain `Artwork`, `Page<T>`.
- `artworks.mapper.ts` — the only place that knows DTO ↔ domain.

The store, components, and tests speak domain types only. A unit
test pins the mapper's behavior including the duplicate-condition
location bug from the original code.

## Consequences

API drift is now a one-file change. Components stay clean.
Trade-off: two type files for a single concept and an extra hop on
every request. For a public API we don't control, this insulation
is worth the small ceremony.
