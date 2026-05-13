# Art Work Collection

A modern Angular SPA that showcases artworks from the [Art Institute of Chicago](https://api.artic.edu) public API. Browse a paginated grid, filter by style, and sort by name, artist, or date.

## Stack

| Layer           | Tech                               |
| --------------- | ---------------------------------- |
| Framework       | Angular 21                         |
| UI Components   | Angular Material 21                |
| HTTP            | Angular HttpClient (fetch backend) |
| Language        | TypeScript 5.9                     |
| Runtime         | Node 22 LTS                        |
| Package manager | pnpm 9                             |
| Reactive        | RxJS 7.8                           |

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `pnpm start`        | Start dev server at localhost:4200 |
| `pnpm build`        | Production build                   |
| `pnpm test`         | Run unit tests                     |
| `pnpm lint`         | Run ESLint                         |
| `pnpm lint:fix`     | Run ESLint with auto-fix           |
| `pnpm format`       | Format all files with Prettier     |
| `pnpm format:check` | Check formatting                   |
| `pnpm typecheck`    | TypeScript type check (no emit)    |

## Local development

```bash
# Requires Node 22 (use nvm)
nvm use

pnpm install
pnpm start
```

## Upgrade journey

This project was modernized from Angular 13.2 to Angular 21, stepping through each major version:

| Commit                                | From | To   |
| ------------------------------------- | ---- | ---- |
| `chore(deps): upgrade angular to v14` | 13.2 | 14.3 |
| `chore(deps): upgrade angular to v15` | 14.3 | 15.2 |
| `chore(deps): upgrade angular to v16` | 15.2 | 16.2 |
| `chore(deps): upgrade angular to v17` | 16.2 | 17.3 |
| `chore(deps): upgrade angular to v18` | 17.3 | 18.2 |
| `chore(deps): upgrade angular to v19` | 18.2 | 19.2 |
| `chore(deps): upgrade angular to v20` | 19.2 | 20.3 |
| `chore(deps): upgrade angular to v21` | 20.3 | 21.2 |

Notable changes per major:

- **v14**: Typed reactive forms, standalone components (developer preview)
- **v15**: Standalone stable, `NgOptimizedImage`, functional router guards
- **v16**: Signals preview, required `@Input()`, `takeUntilDestroyed`, esbuild dev server
- **v17**: Stable signals, new `@if`/`@for`/`@switch` control flow, deferrable views, application builder default
- **v18**: Zoneless change detection preview, Material 3, event replay hydration
- **v19**: Standalone default (`standalone: false` now explicit), `resource()`/`rxResource()` preview
- **v20**: Resource/linked signal APIs stable, Material 3 polish
- **v21**: Latest — polish, stricter DI types, `lib` target bumped to ES2022

## Architecture

Architecture diagram and ADRs coming on Day 5.
