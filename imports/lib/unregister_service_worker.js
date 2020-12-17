/* register service worker */
const unregisterServiceWorker = function() {
  console.log('unregisterServiceWorker');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      if (registrations.length) {
        registrations.forEach((registration) => {
          registration.unregister().then(function (boolean) {
            // eslint-disable-next-line no-console
            console.log((boolean ? 'Successfully unregistered ' : 'Failed to unregister'));
          });
        });
      }
    });
  }
};

export default unregisterServiceWorker;
