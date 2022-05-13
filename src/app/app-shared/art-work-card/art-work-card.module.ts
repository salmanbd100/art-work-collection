import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtWorkCardComponent } from './components/art-work-card/art-work-card.component';
import { NxCardModule } from "@aposin/ng-aquila/card";
import { NxHeadlineModule } from "@aposin/ng-aquila/headline";
import { NxCopytextModule } from "@aposin/ng-aquila/copytext";



@NgModule({
  declarations: [
    ArtWorkCardComponent
  ],
  exports: [
    ArtWorkCardComponent
  ],
  imports: [
    CommonModule,
    NxCardModule,
    NxHeadlineModule,
    NxCopytextModule
  ]
})
export class ArtWorkCardModule { }
