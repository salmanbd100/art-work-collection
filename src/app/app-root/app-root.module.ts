import { NgModule } from '@angular/core';
import { AppRootRoutingModule } from './app-root-routing.module';
import { RootDefaultComponent } from './components/root-default/root-default.component';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    RootDefaultComponent
  ],
  imports: [
    BrowserModule,
    AppRootRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  bootstrap: [
    RootDefaultComponent
  ],
})
export class AppRootModule {
}
