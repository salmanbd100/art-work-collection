import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppArtWorkRoutingModule } from './app-art-work-routing.module';
import { ArtWorkListComponent } from './components/art-work-list/art-work-list.component';
import { ArtWorkDefaultComponent } from './components/art-work-default/art-work-default.component';
import { ArtWorkCardModule } from "../app-shared/art-work-card/art-work-card.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
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
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormsModule,
  ]
})
export class AppArtWorkModule {
}
