import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// uncomment to set license
// import { provideApexTreeLicense } from 'ngx-apextree';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // uncomment to set license
    // provideApexTreeLicense('your-license-key-here'),
  ],
};
