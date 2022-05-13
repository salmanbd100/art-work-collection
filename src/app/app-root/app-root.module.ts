import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRootRoutingModule } from './app-root-routing.module';
import { RootDefaultComponent } from './components/root-default/root-default.component';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    RootDefaultComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRootRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  bootstrap: [
    RootDefaultComponent
  ],
  providers: [HttpClient]
})
export class AppRootModule {
}
