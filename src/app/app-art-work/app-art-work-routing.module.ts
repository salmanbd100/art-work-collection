import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtWorkDefaultComponent } from "./components/art-work-default/art-work-default.component";
import { ArtWorkListComponent } from "./components/art-work-list/art-work-list.component";

const routes: Routes = [
  {
    path: '',
    component: ArtWorkDefaultComponent,
    children: [
      {
        path: '',
        component: ArtWorkListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppArtWorkRoutingModule {
}
