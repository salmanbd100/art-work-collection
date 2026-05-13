import { bootstrapApplication } from '@angular/platform-browser';
import { RootDefaultComponent } from './app/app-root/components/root-default/root-default.component';
import { appConfig } from './app/app.config';

bootstrapApplication(RootDefaultComponent, appConfig).catch((err) =>
  console.error(err),
);
