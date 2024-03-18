// @ts-check
/// <reference path="../serviceworker.types.d.ts" />

/**
 *
 * @type {ServiceWorkerGlobalScope & typeof globalThis} self
 */
let swSelf = /** @type {any} */ (self);

/**
 *
 * @param {string[]} resources
 */
const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

/**
 *
 * @param {{
 *  request: Request;
 *  preloadResponsePromise: Promise<Response>;
 *  fallbackUrl: string;
 * }} obj
 */
const fetchFallback = async ({ request, fallbackUrl }) => {
  const url = new URL(request.url);

  // Next try to get the resource from the network
  try {
    if (
      url.pathname === fallbackUrl &&
      [
        'localhost',
        'localhost:3002',
        'fourscore.app',
        'www.fourscore.app',
      ].includes(url.hostname)
    ) {
      // First try to get the resource from the cache
      const responseFromCache = await caches.match(request);
      if (responseFromCache) {
        return responseFromCache;
      }
      const responseFromNetwork = await fetch(request.clone());
      // response may be used only once
      // we need to save clone to put one copy in cache
      // and serve second one
      putInCache(request, responseFromNetwork.clone());
      return responseFromNetwork;
    } else {
      return await fetch(request.clone());
    }
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

swSelf.addEventListener(
  'install',
  (event) => {
    event.waitUntil(
      addResourcesToCache([
        './offline',
      ]),
    );
  },
);

swSelf.addEventListener(
  'fetch',
  (event) => {
    event.respondWith(
      fetchFallback({
        request: event.request,
        preloadResponsePromise: event.preloadResponse,
        fallbackUrl: './offline',
      }),
    );
  },
);
