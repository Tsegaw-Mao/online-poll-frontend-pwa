/// <reference types="vite-plugin-pwa/client" />

import { Workbox } from 'workbox-window';

export function registerSW() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        // Show update notification
        if (confirm('New version available! Click OK to refresh.')) {
          window.location.reload();
        }
      } else {
        console.log('PWA installed successfully');
      }
    });

    wb.addEventListener('waiting', (event) => {
      // Show update prompt
      if (confirm('New version available! Click OK to update.')) {
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });
        wb.messageSkipWaiting();
      }
    });

    wb.register();
  }
}

// Export for manual registration if needed
export const unregisterSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }
};