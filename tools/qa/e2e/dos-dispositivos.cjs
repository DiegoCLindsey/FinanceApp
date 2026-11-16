// Dos dispositivos contra una nube simulada (Firebase falso compartido en Node).
const { chromium } = require('playwright'); const path = require('path'); const S = process.env.QA_VENDOR_DIR || path.join(__dirname, '..');
const nube = new Map([['whitelist/a@b.c', { isAdmin: false }]]);
let escrituras = [];
const firebaseFalso = () => {
  const user = { uid: 'u1', email: 'a@b.c', getIdToken: async () => 't' };
  const ref = (p) => ({
    collection: (n) => ({ doc: (id) => ref(`${p}/${n}/${id}`) }),
    get: async () => { const d = await window.nubeGet(p); return { exists: !!d, data: () => (d ? { ...d, updatedAt: { toMillis: () => d.updatedAtMs } } : undefined) }; },
    set: async (v) => { await window.nubeSet(p, JSON.parse(JSON.stringify({ ...v, updatedAt: null, updatedAtMs: Date.now() }))); },
  });
  const app = {
    auth: () => ({ signInWithPopup: async () => ({ user }), onAuthStateChanged: (cb) => { setTimeout(() => cb(user), 10); return () => {}; }, signOut: async () => {} }),
    firestore: () => ({ collection: (n) => ({ doc: (id) => ref(`${n}/${id}`) }) }),
    delete: async () => {},
  };
  window.firebase = { initializeApp: () => app, app: () => app, auth: { GoogleAuthProvider: class {} }, firestore: { FieldValue: { serverTimestamp: () => null } } };
  try { localStorage.setItem('financeapp_fbx_config', JSON.stringify({ apiKey: 'x', projectId: 'p' })); } catch {}
};
async function dispositivo(browser, nombre) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, timezoneId: 'Europe/Madrid' });
  await context.route(/cdn\.jsdelivr\.net.*chart\.umd/, (r) => r.fulfill({ path: path.join(S, 'vendor/chart.umd.js'), contentType: 'text/javascript' }));
  await context.route(/cdn\.jsdelivr\.net.*adapter/, (r) => r.fulfill({ path: path.join(S, 'vendor/adapter.js'), contentType: 'text/javascript' }));
  await context.route(/gstatic\.com|googleapis\.com/, (r) => r.abort());
  // Origen http de verdad, servido desde disco por interceptación (sin abrir puertos).
  await context.route('https://financeapp.test/**', (r) => { const u = new URL(r.request().url()); const f = path.join('' + path.resolve(__dirname, '../../..') + '', decodeURIComponent(u.pathname)); require('fs').existsSync(f) && require('fs').statSync(f).isFile() ? r.fulfill({ path: f }) : r.fulfill({ status: 404, body: '' }); });
  await context.exposeFunction('nubeGet', (p) => nube.get(p) ?? null);
  await context.exposeFunction('nubeSet', (p, v) => { nube.set(p, v); escrituras.push(`${nombre}:${p}`); });
  await context.addInitScript(firebaseFalso);
  const page = await context.newPage();
  (globalThis.PGS ||= {})[nombre] = page;
  page.on('pageerror', (e) => console.log(`  [${nombre}] PAGEERROR`, e.message));
  page.on('console', (m) => { if (m.type() === 'error') { const t = m.text(); if (!/Failed to load|firebase-config|PWA/.test(t) || true) console.log(`  [${nombre}] ${t.slice(0, 300)}`); } });
  page.on('dialog', (d) => d.accept());
  await page.goto('https://financeapp.test/index.html');
  return page;
}
const entrar = async (page, clave) => {
  await page.click('#btn-firebase'); await page.click('#btn-firebase-google');
  await page.fill('#fbx-passphrase', clave); await page.click('#btn-fbx-passphrase-ok');
};
const gastos = (page) => page.evaluate(() => FinanceApp.store.get('expenses').map((e) => e.concepto).join(','));
const crear = (page, c) => page.evaluate((c) => { FinanceApp.store.addItem('expenses', { concepto: c, cuantia: 1, tipo: 'gasto', tipoFrecuencia: 'mensual', activo: true, tags: [] }); }, c);
const ok = (cond, msg) => console.log(cond ? '  ✔' : '  ✘ FALLO:', msg);
(async () => {
  const browser = await chromium.launch();
  const A = await dispositivo(browser, 'A');
  await entrar(A, 'clave-buena-123');
  await A.waitForSelector('#main-shell:not(.hidden)');
  await A.evaluate(() => document.getElementById('welcome-overlay').classList.add('hidden'));
  await crear(A, 'A1');
  ok((await A.evaluate(() => AuthModule.guardarEnNube())) === 'subido', 'A sube su primer gasto');

  const B = await dispositivo(browser, 'B');
  await entrar(B, 'clave-buena-123');
  await B.waitForSelector('#main-shell:not(.hidden)');
  ok((await gastos(B)) === 'A1', 'B recibe lo de A sin preguntar → ' + (await gastos(B)));
  await crear(B, 'B1');
  ok((await B.evaluate(() => AuthModule.guardarEnNube())) === 'subido', 'B sube A1,B1');

  await crear(B, 'Bx'); await B.evaluate(() => FinanceApp.ui.avisoGuardado.guardarAhora());
  ok((await B.evaluate(() => FinanceApp.ui.avisoGuardado.hayPendiente())) === false, 'B no tiene pendientes tras guardar por el aviso');
  const antes = escrituras.length;
  // A (atrasado) cambia algo e intenta guardar → conflicto, no pisa
  await crear(A, 'A2');
  const p = A.evaluate(() => AuthModule.guardarEnNube());
  await A.waitForSelector('[data-elige="nube"]', { timeout: 5000 });
  ok(escrituras.length === antes, 'A NO ha escrito en la nube al detectar el conflicto');
  await Promise.all([A.waitForNavigation(), A.click('[data-elige="nube"]')]);
  await A.waitForSelector('#main-shell:not(.hidden)');
  await A.waitForTimeout(600);
  ok((await gastos(A)) === 'A1,B1,Bx', 'A queda con la copia de la nube tras elegirla → ' + (await gastos(A)));
  ok(await A.evaluate(() => !!AuthModule.puntoDeRestauracion()), 'A guardó un punto de restauración con lo suyo');
  ok((await A.evaluate(() => AuthModule.puntoDeRestauracion().datos.expenses.map((e) => e.concepto).join(','))) === 'A1,A2', 'el punto de restauración contiene A1,A2');

  // Reinicio de B sin cambios: no escribe ni pregunta
  const antes2 = escrituras.length;
  await B.reload(); await B.waitForSelector('#main-shell:not(.hidden)'); await B.waitForTimeout(500);
  ok(escrituras.filter((e, i) => i >= antes2 && /backup/.test(e)).length === 0, 'B reinicia sin subir nada');
  // B cambia sin subir y reinicia: sube solo, sin diálogo
  await crear(B, 'B2');
  await B.reload(); await B.waitForSelector('#main-shell:not(.hidden)'); await B.waitForTimeout(500);
  ok(escrituras.slice(antes2).some((e) => e === 'B:users/u1/data/backup'), 'B sube solo sus cambios pendientes al reiniciar');
  ok((await B.$('[data-elige]')) === null, 'sin diálogo de conflicto');
  // A, sin cambios, reinicia: baja B2 sin preguntar
  console.log('  A antes de recargar:', await A.evaluate(() => JSON.stringify({ sello: StorageAdapter.modificadoEn(), selloSync: StorageAdapter.selloEnSync(), base: StorageAdapter.baseNube() })));
  await A.reload(); await A.waitForTimeout(2500);
  console.log('  A tras recargar:', await A.evaluate(() => JSON.stringify({ dialogo: !!document.querySelector('[data-elige]'), shell: !document.getElementById('main-shell').classList.contains('hidden'), paso: [...document.querySelectorAll('[id^=auth-step]')].filter((e) => !e.classList.contains('hidden')).map((e) => e.id), sesion: !!localStorage.getItem('financeapp_session') })));
  ok((await gastos(A)) === 'A1,B1,Bx,B2', 'A baja lo nuevo sin preguntar → ' + (await gastos(A)));

  // Clave mal tecleada en el desbloqueo: no se escribe NADA
  const registroAntes = JSON.stringify(nube.get('users/u1/data/proyectos'));
  ok(!!registroAntes, 'existe la lista de proyectos remota');
  const C = await dispositivo(browser, 'C');
  await C.evaluate(() => localStorage.setItem('financeapp_fbx_email', 'a@b.c'));
  await C.reload();
  await C.waitForSelector('#btn-firebase-google-unlock', { state: 'visible' });
  const antes3 = escrituras.length;
  await C.click('#btn-firebase-google-unlock');
  await C.fill('#fbx-unlock-passphrase', 'clave-mala'); await C.click('#btn-firebase-unlock');
  await C.waitForSelector('#fbx-unlock-passphrase-error:not(.hidden)');
  ok(escrituras.length === antes3, 'con la clave mala no hay ninguna escritura remota');
  ok(JSON.stringify(nube.get('users/u1/data/proyectos')) === registroAntes, 'la lista de proyectos remota sigue intacta');
  await browser.close();
})().catch(async (e) => { console.error('FALLO', e.message.split('\n')[0]); for (const [n, pg] of Object.entries(globalThis.PGS || {})) { try { console.log(n, await pg.evaluate(() => JSON.stringify({ dialogo: !!document.querySelector('[data-elige]'), shell: !document.getElementById('main-shell').classList.contains('hidden'), carga: !!document.getElementById('carga'), paso: [...document.querySelectorAll('[id^=auth-step]')].filter((e) => !e.classList.contains('hidden')).map((e) => e.id), overlay: !document.getElementById('auth-overlay').classList.contains('hidden'), sesion: localStorage.getItem('financeapp_session'), sello: StorageAdapter.modificadoEn(), selloSync: StorageAdapter.selloEnSync(), base: StorageAdapter.baseNube() }))); } catch (x) { console.log(n, 'sin diag', x.message.split('\n')[0]); } } process.exit(1); });
