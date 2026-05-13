import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtWorkCardComponent } from './components/art-work-card/art-work-card.component';
import { MatCardModule } from "@angular/material/card";


@NgModule({
  declarations: [
    ArtWorkCardComponent
  ],
  exports: [
    ArtWorkCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ]
})
export class ArtWorkCardModule {
}
