// Cifrado de los backups (common/crypto.js). Se prueba contra el código real,
// igual que finance-math.test.js: el fichero se autopublica en globalThis.
import { describe, it, expect, beforeAll } from 'vitest';

let CS;
beforeAll(async () => {
  await import('../common/crypto.js');
  CS = globalThis.CryptoService;
});

describe('cifrado portátil', () => {
  it('ida y vuelta con la misma passphrase', async () => {
    const datos = { hola: 'qué tal', numero: 42, lista: [1, 2, 3] };
    const cifrado = await CS.encryptPortable('secreta', datos);
    expect(cifrado.split(':')).toHaveLength(4); // gz1:salt:iv:ct
    expect(await CS.decryptPortable('secreta', cifrado)).toEqual(datos);
  });

  it('con otra passphrase no descifra', async () => {
    const cifrado = await CS.encryptPortable('secreta', { a: 1 });
    await expect(CS.decryptPortable('otra', cifrado)).rejects.toThrow();
  });

  it('cada llamada usa una sal distinta, así que el mismo dato no da el mismo cifrado', async () => {
    const a = await CS.encryptPortable('secreta', { a: 1 });
    const b = await CS.encryptPortable('secreta', { a: 1 });
    expect(a).not.toBe(b);
    expect(await CS.decryptPortable('secreta', b)).toEqual({ a: 1 });
  });

  // Regresión: el backup se pasaba a base64 con `String.fromCharCode(...bytes)`,
  // que mete un argumento por byte. Con una cuenta de verdad importada del banco
  // (unos 800 movimientos) el cifrado ya son cientos de miles de bytes y la
  // llamada moría con "Maximum call stack size exceeded" al subir a Firebase.
  // Con datos de juguete no fallaba nunca: hace falta un backup grande.
  it('un backup grande (miles de movimientos) se cifra y se descifra sin desbordar la pila', async () => {
    const transacciones = Array.from({ length: 3000 }, (_, i) => ({
      _id: `tx_${i}`,
      fecha: '2026-06-01',
      cuentaId: 'default',
      importeCts: -1234 - i,
      concepto: `COMPRA TARJETA ${i} — COMERCIO CON NOMBRE LARGO S.L.`,
      tags: ['super', 'tarjeta'],
      tipo: 'gasto',
      origen: 'importado',
    }));
    const snapshot = { transacciones, config: { dashboardStart: '2026-01-01' } };
    // Que de verdad sea grande: si no, el test no probaría nada.
    expect(JSON.stringify(snapshot).length).toBeGreaterThan(300_000);

    const cifrado = await CS.encryptPortable('secreta', snapshot);
    const vuelta = await CS.decryptPortable('secreta', cifrado);
    expect(vuelta.transacciones).toHaveLength(3000);
    expect(vuelta.transacciones[2999].concepto).toBe(transacciones[2999].concepto);
  });
});

describe('compresión de la copia (BUG-05)', () => {
  const movimientos = (n) =>
    Array.from({ length: n }, (_, i) => ({
      _id: `id${i}`,
      fecha: `2026-${String((i % 12) + 1).padStart(2, '0')}-15`,
      cuentaId: 'default',
      importeCts: -(1000 + i),
      concepto: i % 3 ? 'COMPRA TARJ. MERCADONA VALENCIA ES' : 'RECIBO IBERDROLA CLIENTES SAU',
      tags: [],
      tipo: 'gasto',
      origen: 'importado',
    }));

  it('20.000 movimientos caben de sobra en un documento de 1 MiB', async () => {
    const datos = { transacciones: movimientos(20000), config: { a: 1 } };
    const cifrado = await globalThis.CryptoService.encryptPortable('clave', datos);
    expect(cifrado.startsWith('gz1:')).toBe(true);
    expect(cifrado.length).toBeLessThan(700_000);
    expect(JSON.stringify(datos).length).toBeGreaterThan(3_000_000);
    expect(await globalThis.CryptoService.decryptPortable('clave', cifrado)).toEqual(datos);
  }, 30000);

  it('sigue leyendo el formato anterior, sin comprimir', async () => {
    const C = globalThis.CryptoService;
    const salt = C.generateSalt();
    const key = await C.deriveKey('clave', salt);
    const antiguo = `${btoa(String.fromCharCode(...salt))}:${await C.encrypt(key, { hola: 'mundo', ñ: 'áé€' })}`;
    expect(await C.decryptPortable('clave', antiguo)).toEqual({ hola: 'mundo', ñ: 'áé€' });
  });

  it('conserva acentos y símbolos al comprimir', async () => {
    const datos = { concepto: 'Peluquería «Añil» 12,50 €' };
    const cifrado = await globalThis.CryptoService.encryptPortable('clave', datos);
    expect(await globalThis.CryptoService.decryptPortable('clave', cifrado)).toEqual(datos);
  });
});
