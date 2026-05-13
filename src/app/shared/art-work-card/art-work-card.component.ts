import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Artwork } from '../../data/artworks/artworks.types';
import { formatLocation } from '../../data/artworks/artworks.mapper';
import { environment } from '@environment';
import {
  MatCard,
  MatCardImage,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
  selector: 'app-art-work-card',
  templateUrl: './art-work-card.component.html',
  styleUrls: ['./art-work-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardImage, MatCardHeader, MatCardTitle, MatCardContent],
})
export class ArtWorkCardComponent {
  readonly artWork = input.required<Artwork>();
  readonly iiifUrl = input.required<string>();

  readonly imageUrl = computed(() => {
    const id = this.artWork().imageId;
    if (!id) return environment.defaultImageUrl;
    return `${this.iiifUrl()}/${id}/full/300,/0/default.jpg`;
  });

  readonly location = computed(() => formatLocation(this.artWork()));

  protected defaultImageUrl = environment.defaultImageUrl;
}
