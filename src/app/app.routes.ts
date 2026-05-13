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
          import('./app-art-work/components/art-work-list/art-work-list.component').then(
            (m) => m.ArtWorkListComponent,
          ),
      },
    ],
  },
];
