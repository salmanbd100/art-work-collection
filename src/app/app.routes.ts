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
    ],
  },
];
