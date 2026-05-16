import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Artwork } from '../../data/artworks/artworks.types';
import { formatLocation } from '../../data/artworks/artworks.mapper';
import { FavoritesStore } from '../../features/artworks/state/favorites.store';
import { DetailPreloader } from '../../core/hover-preload.strategy';
import { environment } from '@environment';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-art-work-card',
  templateUrl: './art-work-card.component.html',
  styleUrls: ['./art-work-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgOptimizedImage,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIconButton,
    MatIcon,
  ],
})
export class ArtWorkCardComponent {
  readonly artWork = input.required<Artwork>();
  readonly priority = input(false);

  private readonly favoritesStore = inject(FavoritesStore);
  private readonly detailPreloader = inject(DetailPreloader);

  readonly isFavorited = computed(() => this.favoritesStore.has(this.artWork().id));

  readonly imageUrl = computed(() => {
    const art = this.artWork();
    if (!art.imageId) return environment.defaultImageUrl;
    return `${art.iiifUrl}/${art.imageId}/full/300,/0/default.jpg`;
  });

  readonly location = computed(() => formatLocation(this.artWork()));

  protected defaultImageUrl = environment.defaultImageUrl;

  onFavoriteToggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesStore.toggle(this.artWork());
  }

  onLinkHoverOrFocus(): void {
    this.detailPreloader.preloadDetail();
  }
}
