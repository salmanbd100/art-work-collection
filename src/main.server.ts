import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { RootDefaultComponent } from './app/app-root/components/root-default/root-default.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(RootDefaultComponent, config, context);

export default bootstrap;
