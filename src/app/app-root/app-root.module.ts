import { NgModule } from '@angular/core';
import { AppRootRoutingModule } from './app-root-routing.module';
import { RootDefaultComponent } from './components/root-default/root-default.component';
import { BrowserModule } from "@angular/platform-browser";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


@NgModule({ declarations: [
        RootDefaultComponent
    ],
    bootstrap: [
        RootDefaultComponent
    ], imports: [BrowserModule,
        AppRootRoutingModule,
        BrowserAnimationsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppRootModule {
}
