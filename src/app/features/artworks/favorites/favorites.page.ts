import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { FavoritesStore } from '../state/favorites.store';
import { ArtWorkCardComponent } from '../../../shared/art-work-card/art-work-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButton, ArtWorkCardComponent],
})
export class FavoritesPage {
  protected store = inject(FavoritesStore);
}
