import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';

async function startMocks(): Promise<void> {
    const { worker } = await import('./mocks/browser');
    await worker.start({
        serviceWorker: { url: 'mockServiceWorker.js' },
        onUnhandledRequest: 'bypass',
    });
}

startMocks()
    .catch((error: unknown) =>
        console.warn('[MSW] failed to start, continuing without mocks:', error),
    )
    .finally(
        () =>
            void bootstrapApplication(App, appConfig).catch((error: unknown) =>
                console.error(error),
            ),
    );
