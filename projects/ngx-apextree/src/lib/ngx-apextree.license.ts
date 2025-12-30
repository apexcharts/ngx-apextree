import { InjectionToken, Provider, ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import ApexTree from 'apextree';

/**
 * injection token for apextree license key
 */
export const APEXTREE_LICENSE_KEY = new InjectionToken<string>('APEXTREE_LICENSE_KEY');

/**
 * internal variable to store license key
 */
let licenseKey: string | null = null;

/**
 * static method to set license
 * call this before bootstrapping your app
 *
 * @example
 * ```typescript
 * import { setApexTreeLicense } from 'ngx-apextree';
 *
 * setApexTreeLicense('your-license-key-here');
 *
 * bootstrapApplication(AppComponent, appConfig);
 * ```
 */
export function setApexTreeLicense(license: string): void {
  licenseKey = license;
  // set license in apextree library if it has a method for it
  if (typeof (ApexTree as any).setLicense === 'function') {
    (ApexTree as any).setLicense(license);
  }
}

/**
 * get the currently set license key
 */
export function getApexTreeLicense(): string | null {
  return licenseKey;
}

/**
 * angular provider function for license configuration
 * use this in your app config or module providers
 *
 * @example
 * ```typescript
 * // standalone app (app.config.ts)
 * import { provideApexTreeLicense } from 'ngx-apextree';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideApexTreeLicense('your-license-key-here'),
 *   ]
 * };
 *
 * // module-based app (app.module.ts)
 * @NgModule({
 *   providers: [
 *     provideApexTreeLicense('your-license-key-here'),
 *   ]
 * })
 * export class AppModule { }
 * ```
 */
export function provideApexTreeLicense(license: string): Provider[] {
  return [
    {
      provide: APEXTREE_LICENSE_KEY,
      useValue: license,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        setApexTreeLicense(license);
      },
    },
  ];
}
