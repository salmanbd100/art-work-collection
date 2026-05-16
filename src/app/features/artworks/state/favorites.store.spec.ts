import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavoritesStore } from './favorites.store';
import { Artwork } from '../../../data/artworks/artworks.types';

function makeArtwork(id: number, title = 'Test'): Artwork {
  return {
    id,
    title,
    artist: 'Artist',
    location: '',
    imageId: null,
    startDate: null,
    endDate: null,
    materials: [],
    styleTitles: [],
  };
}

describe('FavoritesStore', () => {
  let store: FavoritesStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [FavoritesStore] });
    store = TestBed.inject(FavoritesStore);
  });

  it('should start with empty favorites', () => {
    expect(store.favorites()).toHaveLength(0);
  });

  it('should add an artwork via toggle', () => {
    const art = makeArtwork(1, 'Monet');
    store.toggle(art);
    expect(store.favorites()).toHaveLength(1);
    expect(store.favorites()[0]?.title).toBe('Monet');
  });

  it('should remove an artwork when toggled twice', () => {
    const art = makeArtwork(2);
    store.toggle(art);
    store.toggle(art);
    expect(store.favorites()).toHaveLength(0);
  });

  it('has() returns true for favorited artwork', () => {
    const art = makeArtwork(3);
    store.toggle(art);
    expect(store.has(3)).toBe(true);
  });

  it('has() returns false for non-favorited artwork', () => {
    expect(store.has(99)).toBe(false);
  });

  it('should persist multiple artworks independently', () => {
    store.toggle(makeArtwork(1));
    store.toggle(makeArtwork(2));
    store.toggle(makeArtwork(3));
    expect(store.favorites()).toHaveLength(3);
    store.toggle(makeArtwork(2));
    expect(store.favorites()).toHaveLength(2);
    expect(store.has(2)).toBe(false);
    expect(store.has(1)).toBe(true);
    expect(store.has(3)).toBe(true);
  });

  it('should persist favorites to localStorage on toggle', fakeAsync(() => {
    store.toggle(makeArtwork(10, 'Persist Me'));
    TestBed.flushEffects();
    tick();
    const raw = localStorage.getItem('awc.favorites.v1');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as Artwork[];
    expect(parsed[0]?.id).toBe(10);
  }));

  it('should load existing favorites from localStorage on init', () => {
    const stored: Artwork[] = [makeArtwork(7, 'Pre-stored')];
    localStorage.setItem('awc.favorites.v1', JSON.stringify(stored));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [FavoritesStore] });
    const freshStore = TestBed.inject(FavoritesStore);
    expect(freshStore.favorites()).toHaveLength(1);
    expect(freshStore.favorites()[0]?.title).toBe('Pre-stored');
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('awc.favorites.v1', 'not-valid-json{{{');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [FavoritesStore] });
    const freshStore = TestBed.inject(FavoritesStore);
    expect(freshStore.favorites()).toHaveLength(0);
  });
});
