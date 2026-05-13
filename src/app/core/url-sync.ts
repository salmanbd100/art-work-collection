import { effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworksStore } from '../features/artworks/state/artworks.store';
import { ArtworkSort } from '../data/artworks/artworks.types';

export function useUrlSync(): void {
  const store = inject(ArtworksStore);
  const route = inject(ActivatedRoute);
  const router = inject(Router);

  // Read URL state once on init
  const snap = route.snapshot.queryParamMap;
  store.syncFromUrl({
    q: snap.get('q') ?? '',
    sort: (snap.get('sort') as ArtworkSort | null) ?? null,
    styles: snap.get('style')?.split(',').filter(Boolean) ?? [],
    page: Number(snap.get('page') ?? 1),
  });

  // Write URL whenever store state changes
  effect(() => {
    const q = store.query();
    const sort = store.sort();
    const styles = store.styleFilters();
    const page = store.page();
    void router.navigate([], {
      relativeTo: route,
      queryParams: {
        q: q || null,
        sort: sort ?? null,
        style: styles.length ? styles.join(',') : null,
        page: page > 1 ? page : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });
}
