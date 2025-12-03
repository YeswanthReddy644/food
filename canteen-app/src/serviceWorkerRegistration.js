// Simple service worker registration helper
// Registers `/sw.js` if available and logs lifecycle events.
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/)
);

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      if (isLocalhost) {
        // In localhost, just try to register normally
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('ServiceWorker registration successful on localhost:', registration);
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
          });
      } else {
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('ServiceWorker registered:', registration);
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
          });
      }
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

export default { register, unregister };
