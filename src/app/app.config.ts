import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { routes } from './app.routes';
import { baseUrlInterceptor } from './core/http/base-url.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { HoverPreloadStrategy } from './core/hover-preload.strategy';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions(), withPreloading(HoverPreloadStrategy)),
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, errorInterceptor, loadingInterceptor]),
    ),
    provideAnimationsAsync(),
    { provide: IMAGE_LOADER, useValue: (config: ImageLoaderConfig) => config.src },
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: false }),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
