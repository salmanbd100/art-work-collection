import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppArtWorkRoutingModule } from './app-art-work-routing.module';
import { ArtWorkListComponent } from './components/art-work-list/art-work-list.component';
import { ArtWorkDefaultComponent } from './components/art-work-default/art-work-default.component';
import { ArtWorkCardModule } from "../app-shared/art-work-card/art-work-card.module";
import { NxGridModule } from "@aposin/ng-aquila/grid";
import { NxPaginationModule } from "@aposin/ng-aquila/pagination";
import { NxSpinnerModule } from "@aposin/ng-aquila/spinner";
import { NxFormfieldModule } from "@aposin/ng-aquila/formfield";
import { NxDropdownModule } from "@aposin/ng-aquila/dropdown";
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    ArtWorkListComponent,
    ArtWorkDefaultComponent
  ],
  imports: [
    CommonModule,
    AppArtWorkRoutingModule,
    ArtWorkCardModule,
    NxGridModule,
    NxPaginationModule,
    NxSpinnerModule,
    NxFormfieldModule,
    NxDropdownModule,
    FormsModule,
  ]
})
export class AppArtWorkModule {
}
