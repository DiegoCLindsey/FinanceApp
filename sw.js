/**
 * Service worker de FinanceApp.
 *
 * ── Por qué NO precachea una lista de ficheros ──────────────────────────────
 * El despliegue versiona cada URL propia con `?v=<sha>` (paso «Version local
 * assets» de deploy.yml), así que una lista fija de rutas sin versionar
 * cachearía entradas que la aplicación nunca pide. En su lugar se cachea al
 * vuelo lo que se va usando: cada despliegue estrena URLs y las cachea en su
 * primer uso.
 *
 * ── Estrategias ────────────────────────────────────────────────────────────
 *   · Navegación (index.html)  → RED PRIMERO, caché como red de seguridad.
 *     Es deliberado: con «caché primero» el usuario se quedaría viendo una
 *     versión vieja de una aplicación de finanzas hasta la segunda recarga.
 *     Estando conectado siempre ve la última; sin red, la última que vio.
 *   · Recursos propios         → caché primero. Van versionados por URL, así
 *     que una entrada cacheada JAMÁS queda obsoleta: si cambia, cambia la URL.
 *   · Fuentes de Google        → caché primero; la aplicación funciona igual
 *     si no llegan.
 *   · Firebase, Dropbox y toda API → nunca se cachean. Son datos vivos, y
 *     servir un saldo viejo desde la caché sería peor que no servir nada.
 */

const VERSION = 'v1';
const CACHE_APP = `financeapp-${VERSION}`;
const CACHE_CDN = `financeapp-cdn-${VERSION}`;

/**
 * Terceros que SÍ se cachean, con caché primero. Los tres sirven recursos
 * inmutables y versionados en la propia URL, así que una entrada guardada no
 * puede quedar obsoleta. Sin jsDelivr la aplicación abriría sin red pero sin
 * gráficos, que es justo lo que se va a mirar.
 */
const HOSTS_FUENTES = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

/** Nunca se cachea: datos vivos y autenticación. */
const NUNCA = /firestore|firebaseio|identitytoolkit|securetoken|googleapis\.com\/identitytoolkit|dropboxapi|dropbox\.com/i;

self.addEventListener('install', (event) => {
  // Solo el shell mínimo; el resto entra al usarse.
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_APP);
      await Promise.all(['./', './index.html', './manifest.webmanifest'].map((url) => cache.add(url).catch(() => {})));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const claves = await caches.keys();
      await Promise.all(
        claves.filter((k) => k.startsWith('financeapp-') && !k.endsWith(VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (NUNCA.test(url.href)) return;

  if (HOSTS_FUENTES.includes(url.hostname)) {
    event.respondWith(cachePrimero(request, CACHE_CDN));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(redPrimero(request, CACHE_APP));
    return;
  }

  event.respondWith(cachePrimero(request, CACHE_APP));
});

async function cachePrimero(request, nombreCache) {
  const cache = await caches.open(nombreCache);
  const guardado = await cache.match(request);
  if (guardado) return guardado;
  try {
    const respuesta = await fetch(request);
    // `opaque` son respuestas sin CORS (las fuentes): se guardan igual.
    if (respuesta.ok || respuesta.type === 'opaque') cache.put(request, respuesta.clone());
    return respuesta;
  } catch {
    return Response.error();
  }
}

async function redPrimero(request, nombreCache) {
  const cache = await caches.open(nombreCache);
  try {
    const respuesta = await fetch(request);
    if (respuesta.ok) cache.put(request, respuesta.clone());
    return respuesta;
  } catch {
    return (await cache.match(request)) ?? (await cache.match('./index.html')) ?? Response.error();
  }
}

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
