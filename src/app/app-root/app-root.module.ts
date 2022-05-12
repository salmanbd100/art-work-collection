import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRootRoutingModule } from './app-root-routing.module';
import { RootDefaultComponent } from './components/root-default/root-default.component';
import { BrowserModule } from "@angular/platform-browser";


@NgModule({
  declarations: [
    RootDefaultComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRootRoutingModule,

  ],
  bootstrap: [
    RootDefaultComponent
  ]
})
export class AppRootModule {
}
