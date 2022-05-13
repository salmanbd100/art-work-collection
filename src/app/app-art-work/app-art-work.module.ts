import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppArtWorkRoutingModule } from './app-art-work-routing.module';
import { ArtWorkListComponent } from './components/art-work-list/art-work-list.component';
import { ArtWorkDefaultComponent } from './components/art-work-default/art-work-default.component';
import { ArtWorkDetailComponent } from './components/art-work-detail/art-work-detail.component';
import { ArtWorkCardModule } from "../app-shared/art-work-card/art-work-card.module";
import { NxGridModule } from "@aposin/ng-aquila/grid";



@NgModule({
  declarations: [
    ArtWorkListComponent,
    ArtWorkDefaultComponent,
    ArtWorkDetailComponent
  ],
  imports: [
    CommonModule,
    AppArtWorkRoutingModule,
    ArtWorkCardModule,
    NxGridModule,
  ]
})
export class AppArtWorkModule { }