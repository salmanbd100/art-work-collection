import { Injectable, computed, effect, signal } from '@angular/core';
import { Artwork } from '../../../data/artworks/artworks.types';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly KEY = 'awc.favorites.v1';
  private readonly map = signal<Map<number, Artwork>>(this.initMap());
  readonly favorites = computed(() => [...this.map().values()]);

  constructor() {
    effect(() => {
      localStorage.setItem(this.KEY, JSON.stringify([...this.map().values()]));
    });
  }

  private initMap(): Map<number, Artwork> {
    try {
      const raw = localStorage.getItem('awc.favorites.v1');
      if (!raw) return new Map();
      const items = JSON.parse(raw) as Artwork[];
      return new Map(items.map((a) => [a.id, a]));
    } catch {
      return new Map();
    }
  }

  toggle(artwork: Artwork): void {
    this.map.update((m) => {
      const next = new Map(m);
      if (next.has(artwork.id)) {
        next.delete(artwork.id);
      } else {
        next.set(artwork.id, artwork);
      }
      return next;
    });
  }

  has(id: number): boolean {
    return this.map().has(id);
  }
}
