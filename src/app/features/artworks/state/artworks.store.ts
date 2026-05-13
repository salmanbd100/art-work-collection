import { Injectable, computed, signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ArtworksApi } from '../../../data/artworks/artworks.api';
import { Artwork, ArtworkSort } from '../../../data/artworks/artworks.types';

export function sortArtworks(artworks: Artwork[], sort: ArtworkSort | null): Artwork[] {
  if (!sort) return artworks;
  return [...artworks].sort((a, b) => {
    if (sort === 'name') return a.title.localeCompare(b.title);
    if (sort === 'artist') return a.artist.localeCompare(b.artist);
    if (sort === 'date') return (a.startDate ?? 0) - (b.startDate ?? 0);
    return 0;
  });
}

export function filterByStyles(artworks: Artwork[], styles: string[]): Artwork[] {
  if (!styles.length) return artworks;
  return artworks.filter((a) => styles.some((s) => a.styleTitles.includes(s)));
}

export function computeStyleFacets(artworks: Artwork[]): { styleTitle: string; count: number }[] {
  const map = new Map<string, number>();
  for (const a of artworks) {
    for (const s of a.styleTitles) {
      map.set(s, (map.get(s) ?? 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([styleTitle, count]) => ({ styleTitle, count }));
}

@Injectable({ providedIn: 'root' })
export class ArtworksStore {
  private api = inject(ArtworksApi);

  readonly query = signal('');
  readonly sort = signal<ArtworkSort | null>(null);
  readonly styleFilters = signal<string[]>([]);
  readonly page = signal(1);
  readonly perPage = signal(8);

  private artworksResource = rxResource({
    request: () => ({ page: this.page(), perPage: this.perPage() }),
    loader: ({ request }) => this.api.list(request),
  });

  readonly isLoading = this.artworksResource.isLoading;
  readonly error = this.artworksResource.error;
  readonly iiifUrl = computed(() => this.artworksResource.value()?.iiifUrl ?? '');
  readonly totalCount = computed(() => this.artworksResource.value()?.total ?? 0);
  readonly totalPages = computed(() => this.artworksResource.value()?.totalPages ?? 0);

  private readonly rawArtworks = computed(() => this.artworksResource.value()?.items ?? []);

  readonly filteredArtworks = computed(() =>
    sortArtworks(filterByStyles(this.rawArtworks(), this.styleFilters()), this.sort()),
  );

  readonly styleFacets = computed(() => computeStyleFacets(this.rawArtworks()));

  setSort(sort: ArtworkSort | null): void {
    this.sort.set(sort);
  }

  toggleStyle(style: string): void {
    this.styleFilters.update((styles) =>
      styles.includes(style) ? styles.filter((s) => s !== style) : [...styles, style],
    );
  }

  clearStyles(): void {
    this.styleFilters.set([]);
  }

  setPage(page: number): void {
    this.page.set(page);
    this.clearStyles();
  }

  setPerPage(perPage: number): void {
    this.perPage.set(perPage);
    this.page.set(1);
    this.clearStyles();
  }

  retry(): void {
    this.artworksResource.reload();
  }
}
