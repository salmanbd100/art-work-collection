import { sortArtworks, filterByStyles, computeStyleFacets, ArtworksStore } from './artworks.store';
import { Artwork, ArtworkSort } from '../../../data/artworks/artworks.types';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

function makeArtwork(overrides: Partial<Artwork> = {}): Artwork {
  return {
    id: 1,
    imageId: null,
    title: 'Test Title',
    artist: 'Test Artist',
    location: 'France',
    startDate: 1900,
    endDate: 1910,
    materials: [],
    styleTitles: [],
    ...overrides,
  };
}

describe('sortArtworks', () => {
  it('should return original array when sort is null', () => {
    const artworks = [makeArtwork({ title: 'Z' }), makeArtwork({ title: 'A' })];
    const result = sortArtworks(artworks, null);
    expect(result[0]?.title).toBe('Z');
    expect(result[1]?.title).toBe('A');
  });

  it('should sort by name alphabetically', () => {
    const artworks = [makeArtwork({ title: 'Zebra' }), makeArtwork({ title: 'Apple' })];
    const result = sortArtworks(artworks, 'name' as ArtworkSort);
    expect(result[0]?.title).toBe('Apple');
    expect(result[1]?.title).toBe('Zebra');
  });

  it('should sort by artist alphabetically', () => {
    const artworks = [makeArtwork({ artist: 'Zola' }), makeArtwork({ artist: 'Archer' })];
    const result = sortArtworks(artworks, 'artist' as ArtworkSort);
    expect(result[0]?.artist).toBe('Archer');
    expect(result[1]?.artist).toBe('Zola');
  });

  it('should sort by date ascending', () => {
    const artworks = [makeArtwork({ startDate: 2000 }), makeArtwork({ startDate: 1800 })];
    const result = sortArtworks(artworks, 'date' as ArtworkSort);
    expect(result[0]?.startDate).toBe(1800);
    expect(result[1]?.startDate).toBe(2000);
  });

  it('should treat null startDate as 0 when sorting by date', () => {
    const artworks = [makeArtwork({ startDate: 1900 }), makeArtwork({ startDate: null })];
    const result = sortArtworks(artworks, 'date' as ArtworkSort);
    expect(result[0]?.startDate).toBeNull();
    expect(result[1]?.startDate).toBe(1900);
  });
});

describe('filterByStyles', () => {
  it('should return all artworks when styles is empty', () => {
    const artworks = [
      makeArtwork({ styleTitles: ['Impressionism'] }),
      makeArtwork({ styleTitles: [] }),
    ];
    expect(filterByStyles(artworks, [])).toEqual(artworks);
  });

  it('should filter to artworks that include any of the given styles', () => {
    const artworks = [
      makeArtwork({ id: 1, styleTitles: ['Impressionism'] }),
      makeArtwork({ id: 2, styleTitles: ['Realism'] }),
      makeArtwork({ id: 3, styleTitles: ['Modernism'] }),
    ];
    const result = filterByStyles(artworks, ['Impressionism', 'Modernism']);
    expect(result.length).toBe(2);
    expect(result.map((a) => a.id)).toEqual([1, 3]);
  });

  it('should return empty array when no artworks match', () => {
    const artworks = [makeArtwork({ styleTitles: ['Realism'] })];
    expect(filterByStyles(artworks, ['Impressionism'])).toEqual([]);
  });
});

describe('computeStyleFacets', () => {
  it('should return empty array when artworks have no styles', () => {
    const artworks = [makeArtwork({ styleTitles: [] })];
    expect(computeStyleFacets(artworks)).toEqual([]);
  });

  it('should count styles correctly', () => {
    const artworks = [
      makeArtwork({ styleTitles: ['Impressionism', 'Realism'] }),
      makeArtwork({ styleTitles: ['Impressionism'] }),
    ];
    const result = computeStyleFacets(artworks);
    const impressionism = result.find((f) => f.styleTitle === 'Impressionism');
    const realism = result.find((f) => f.styleTitle === 'Realism');
    expect(impressionism?.count).toBe(2);
    expect(realism?.count).toBe(1);
  });

  it('should return one entry per unique style', () => {
    const artworks = [
      makeArtwork({ styleTitles: ['A', 'B'] }),
      makeArtwork({ styleTitles: ['B', 'C'] }),
    ];
    const result = computeStyleFacets(artworks);
    expect(result.length).toBe(3);
  });
});

describe('ArtworksStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtworksStore, provideHttpClient()],
    });
  });

  it('should update sort signal via setSort', () => {
    const store = TestBed.inject(ArtworksStore);
    store.setSort('name');
    expect(store.sort()).toBe('name');
  });

  it('should toggle style on and off via toggleStyle', () => {
    const store = TestBed.inject(ArtworksStore);
    store.toggleStyle('Impressionism');
    expect(store.styleFilters()).toContain('Impressionism');
    store.toggleStyle('Impressionism');
    expect(store.styleFilters()).not.toContain('Impressionism');
  });

  it('should add a style without removing others via toggleStyle', () => {
    const store = TestBed.inject(ArtworksStore);
    store.toggleStyle('Impressionism');
    store.toggleStyle('Realism');
    expect(store.styleFilters()).toEqual(['Impressionism', 'Realism']);
  });

  it('should empty styleFilters via clearStyles', () => {
    const store = TestBed.inject(ArtworksStore);
    store.toggleStyle('Impressionism');
    store.clearStyles();
    expect(store.styleFilters()).toEqual([]);
  });

  it('should set page and clear styles via setPage', () => {
    const store = TestBed.inject(ArtworksStore);
    store.toggleStyle('Impressionism');
    store.setPage(3);
    expect(store.page()).toBe(3);
    expect(store.styleFilters()).toEqual([]);
  });

  it('should set perPage, reset page to 1, and clear styles via setPerPage', () => {
    const store = TestBed.inject(ArtworksStore);
    store.setPage(5);
    store.toggleStyle('Realism');
    store.setPerPage(16);
    expect(store.perPage()).toBe(16);
    expect(store.page()).toBe(1);
    expect(store.styleFilters()).toEqual([]);
  });
});
