import { provideHttpClient } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { huPaginatorIntl } from './utils/functions/paginator.intl';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withViewTransitions()),
        provideHttpClient(),
        { provide: MatPaginatorIntl, useFactory: huPaginatorIntl },
    ],
};
