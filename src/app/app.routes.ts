import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app-art-work/components/art-work-default/art-work-default.component').then(
        (m) => m.ArtWorkDefaultComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/artworks/list/artworks-list.page').then((m) => m.ArtworksListPage),
      },
      {
        path: 'artworks/:id',
        loadComponent: () =>
          import('./features/artworks/detail/artwork-detail.page').then((m) => m.ArtworkDetailPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/artworks/favorites/favorites.page').then((m) => m.FavoritesPage),
      },
    ],
  },
];
