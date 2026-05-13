import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppRootModule } from "./app/app-root/app-root.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppRootModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));
