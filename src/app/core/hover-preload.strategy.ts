import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route, RouterPreloader } from '@angular/router';
import { EMPTY, Observable, Subject } from 'rxjs';

/**
 * Tracks which route paths have been requested for preloading.
 * Call register(path) when a user hovers or focuses a link — the router
 * will then load that chunk on the next preloader tick.
 */
@Injectable({ providedIn: 'root' })
export class PreloadRegistry {
  private readonly pending = new Set<string>();
  /** Emit when a new path is registered so the preloader can be triggered. */
  readonly registered$ = new Subject<string>();

  register(path: string): void {
    if (!this.pending.has(path)) {
      this.pending.add(path);
      this.registered$.next(path);
    }
  }

  has(path: string): boolean {
    return this.pending.has(path);
  }
}

/**
 * Custom PreloadingStrategy that only preloads routes whose path has been
 * registered via PreloadRegistry (e.g. on link hover/focus).
 */
@Injectable({ providedIn: 'root' })
export class HoverPreloadStrategy implements PreloadingStrategy {
  private readonly registry = inject(PreloadRegistry);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return this.registry.has(route.path ?? '') ? load() : EMPTY;
  }
}

/**
 * Call this in a component to preload the detail route on pointer/focus entry.
 * Usage: (mouseenter)="preloadDetail()" (focusin)="preloadDetail()"
 */
@Injectable({ providedIn: 'root' })
export class DetailPreloader {
  private readonly registry = inject(PreloadRegistry);
  private readonly preloader = inject(RouterPreloader);

  preloadDetail(): void {
    if (!this.registry.has('artworks/:id')) {
      this.registry.register('artworks/:id');
      void this.preloader.preload();
    }
  }
}
