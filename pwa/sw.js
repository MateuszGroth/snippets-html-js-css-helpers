const expectedCaches = ['static-v2'];

// when these files change, theirs hashes will change
// so they have to be updated here as well as the server has to serve the right html file
// ! js and css files will be served by the html file, so it will know what are the hashes
const staticFiles = [
  '/index.adsadasd.html',
  '/main.asdasdas.css',
  '/index.asdasdasd.js',
];
self.addEventListener('install', (event) => {
  // if skip waiting is called, new service worker kicks out the old one (if there was an old one)
  //   self.skipWaiting();
  event.waitUntil(
    caches.open('static-v2').then((cache) => cache.addAll(staticFiles))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin == 'http://gravatar.com') {
    event.respondWith(handleAvatarRequest(event));
    return;
  }

  if (url.origin == location.origin && url.pathname == '/') {
    // not needed since we are caching '/'
    event.respondWith(caches.match('/index.adsadasd.html')); // main index html with hash
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)) // if was cached, return, otherwise fetch it
  );
});

const handleAvatarRequest = (event) => {
  // if fetch fails (because of no internet), serve fallback avatar

  return fetch(event.request).catch(() => caches.match(`/fallback-avatar.png`));
};

// new way - cache the requested avatars
// at some point this avatar cache has to be cleared
const newHandleAvatarRequest = (event) => {
  // here we cache avatars that came from the web
  // in order to do that, we have to clone the response of that avatar fetch and put it into cache
  // (so we dont fetch it twice - second for the cache)
  const networkFetch = fetch(event.request);

  // ? what happens when there are multiple calls for the same avatar, is it cached multiple times?
  event.waitUntil(
    networkFetch.then((response) => {
      // have to clone response because it can be read only once
      const responseClone = response.clone();
      caches
        .open('avatars')
        .then((cache) => cache.put(event.request, responseClone));
    })
  );

  // return cached avatar or fetched from network if there is no cache
  return caches
    .match(event.request)
    .then((response) => response || networkFetch);
};

// background synchronization
// if no internet, send message as soon it is back
// if internet, send immedietly

// this piece of code comes from the browser js
// index.js

function onSendMessage(message) {
  addToOutBox(message) // add to indexedDb as message that is supposed to be send - might be the same store as all messages or a different one
    .then(() => navigator.serviceWorker.ready)
    .then((req) => req.sync.register('send-message'))
    .catch(() => sendMessageToServer(message)); // in case sync is not supported, sendMessage in a default way
}

// back to sw.js

self.addEventListener('sync', (event) => {
  if (event.tag === 'send-message') {
    event.waitUntil(
      getMessagesFromOutbox().then((messages) => {
        // here we are sending first, then removing from outbox
        // but what if user sends another message without internet
        // he will call this sync again, get both messages here (first one was also received on previous sync)
        // and try to send them - first message would be send twice

        // ? consider first removing from the outbox then sending them
        // ? or updating the messages when getMessagesFromOutbox is called - setting status to sendAttempted  = true or smth
        // ? and then not fetching these from indexeddb when it has status sendAttempted true

        // or on the front page, if there is a message in the outbox, disable sending
        // and postMessage to enable sending when removeMessageFromOutbox is called
        return sendMessagesToServer(messages).then(() =>
          removeMessagesFromOutbox(messages)
        );
      })
    );
  }
});

// handling service worker updates
// index.js

// get the ServiceWorkerRegistration instance
const registration = await navigator.serviceWorker.getRegistration();
// (it is also returned from navigator.serviceWorker.register() function)

if (registration) {
  // if there is a SW active
  registration.addEventListener('updatefound', () => {
    console.log('Service Worker update detected!');
  });
}

/*
So far so good. Is this handler a good place to trigger our update UX (like that "new version available" notification)?
 No, it's not. At this point we only know the browser detected the Service Worker file change. The new Service Worker
  instance is not yet ready for activation, because its install handler is not yet
 complete and it actually may fail to install, for instance when any of its network calls fail.
 We must wait until the new instance is ready for activation (its state is installed):
  */

// our new instance is visible under installing property, because it is in 'installing' state
// let's wait until it changes its state
registration.installing.addEventListener('statechange', () => {
  if (registration.waiting) {
    // our new instance is now waiting for activation (its state is 'installed')
    // we now may invoke our update UX safely
    //! here we display the notificationBanner and let user click it
    notificationBanner.addEventListener('click', () => {
      registration.waiting.postMessage('SKIP_WAITING');
    });
  } else {
    // apparently installation must have failed (SW state is 'redundant')
    // it makes no sense to think about this update any more
  }
});

/*
Now, the third step in this update dance is to actually signal our new Service Worker instance when the user (or our 
heuristic) decided it's a good time to apply the update. It's the Service Worker that needs to call
skipWaiting and we can only communicate with it by sending it a message with postMessage API:  
*/

// ! full solution update
// index.js

function invokeServiceWorkerUpdateFlow(registration) {
  // TODO implement your own UI notification element
  notification.show('New version of the app is available. Refresh now?');
  notification.addEventListener('click', () => {
    if (registration.waiting) {
      // let waiting Service Worker know it should became active
      registration.waiting.postMessage('SKIP_WAITING');
    }
  });
}

// check if the browser supports serviceWorker at all
if ('serviceWorker' in navigator) {
  // wait for the page to load
  window.addEventListener('load', async () => {
    // register the service worker from the file specified
    const registration = await navigator.serviceWorker.register('/sw.js');

    // ensure the case when the updatefound event was missed is also handled
    // by re-invoking the prompt when there's a waiting Service Worker
    if (registration.waiting) {
      invokeServiceWorkerUpdateFlow(registration);
    }

    // ! if there was controller installed already and new sw would not be available, registration.waiting would be false
    // ! and updatefound would not fire

    // detect Service Worker update available and wait for it to become installed
    registration.addEventListener('updatefound', () => {
      // if there is no installing sw, it means that the new sw failed
      if (registration.installing) {
        // wait until the new (currently installing) Service worker is actually installed (ready to take over)
        registration.installing.addEventListener('statechange', () => {
          // if there is no registration.waiting (waiting sw), it means the installation failed
          if (registration.waiting) {
            // if there's an existing controller (previous Service Worker), show the prompt
            if (navigator.serviceWorker.controller) {
              invokeServiceWorkerUpdateFlow(registration);
            } else {
              // otherwise it's the first install, nothing to do
              // it will take control on its own
              console.log('Service Worker initialized for the first time');
            }
          }
        });
      }
    });

    let refreshing = false;

    // detect controller change and refresh the page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  });
}

// sw.js

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    // browser will reload now
    self.skipWaiting();
  }
});
