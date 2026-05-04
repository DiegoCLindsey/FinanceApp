'use strict';
// Standalone Node.js tests for salary/IRPF projection logic.
// Run with: node tests/nomina.test.js
const assert = require('assert');

// ── Inline copies of pure functions under test ────────────────────────────────

const TRAMOS_DEFAULT = [[0,19],[12450,24],[20200,30],[35200,37],[60000,45],[300000,47]];

function calcIRPF(baseImponible, tramos) {
  const sorted = [...tramos].sort((a,b)=>a[0]-b[0]);
  let impuesto = 0, base = baseImponible;
  for (let i = sorted.length-1; i >= 0; i--) {
    const [min, tipo] = sorted[i];
    if (base <= min) continue;
    impuesto += (base - min) * (tipo/100);
    base = min;
  }
  return impuesto;
}

function retencionMensual(salarioAnual, tramos) {
  return calcIRPF(salarioAnual, tramos) / 12;
}

function resolverDiaEfectivo(year, month, diaPago) {
  if (!diaPago) return null;
  if (diaPago.startsWith('dia:')) {
    const v = diaPago.slice(4);
    if (v === 'ultimo') {
      return new Date(year, month+1, 0).toISOString().slice(0,10);
    }
    const n = parseInt(v);
    if (!isNaN(n)) {
      const lastDay = new Date(year, month+1, 0).getDate();
      return new Date(year, month, Math.min(n, lastDay)).toISOString().slice(0,10);
    }
  }
  return null;
}

function proyectarGastos(expenses, dateStart, dateEnd, filtroAccounts=null) {
  const events = [];
  const dS = new Date(dateStart+'T00:00:00'), dE = new Date(dateEnd+'T00:00:00');
  for (const exp of expenses) {
    if (!exp.activo) continue;
    if (filtroAccounts && filtroAccounts.length>0 && !filtroAccounts.includes(exp.cuenta||'default')) continue;
    const dI = new Date((exp.fechaInicio||dateStart)+'T00:00:00');
    const dF = exp.fechaFin ? new Date(exp.fechaFin+'T00:00:00') : dE;
    const push = (fecha) => events.push({
      fecha, concepto:exp.concepto, cuantia:exp.cuantia, tipo:exp.tipo,
      tags:exp.tags, cuenta:exp.cuenta||'default', sourceId:exp._id, sourceType:'expense'
    });
    if (exp.tipoFrecuencia === 'extraordinario') {
      if (dI >= dS && dI <= dE && dI <= dF) push(exp.fechaInicio);
    } else if (exp.tipoFrecuencia === 'mensual') {
      const freq = Math.max(1, exp.frecuencia || 1);
      let year = dI.getFullYear(), month = dI.getMonth();
      const maxIter = Math.ceil(240 / freq) + 2;
      for (let iter = 0; iter < maxIter; iter++) {
        const fechaEfectiva = resolverDiaEfectivo(year, month, exp.diaPago||'') ||
          (() => {
            const dayOfMonth = dI.getDate();
            const lastDay = new Date(year, month+1, 0).getDate();
            return new Date(year, month, Math.min(dayOfMonth, lastDay)).toISOString().slice(0,10);
          })();
        const dEfect = new Date(fechaEfectiva+'T00:00:00');
        if (dEfect > dE || dEfect > dF) break;
        if (dEfect >= dS && dEfect >= dI) push(fechaEfectiva);
        month += freq;
        if (month >= 12) { year += Math.floor(month/12); month = month % 12; }
      }
    }
  }
  return events;
}

function proyectarRetencionesFiscales(expenses, config, dateStart, dateEnd, filtroAccounts=null) {
  const events = [];
  const tramos = config.tramos_irpf || TRAMOS_DEFAULT;
  for (const exp of expenses) {
    if (!exp.activo || exp.tipo !== 'ingreso' || !exp.sujetoIRPF) continue;
    const salarioAnual = exp.cuantia * (exp.tipoFrecuencia==='mensual' ? 12 : 1);
    const ret = retencionMensual(salarioAnual, tramos);
    const mockGastoFiscal = { ...exp, _id: exp._id+'_irpf', concepto: `IRPF salario ${exp.concepto}`, tipo:'gasto', cuantia: ret, tags:['irpf','fiscal'], basico:false };
    const evs = proyectarGastos([mockGastoFiscal], dateStart, dateEnd, filtroAccounts);
    events.push(...evs);
  }
  return events;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function approxEq(a, b, eps=0.01) { return Math.abs(a-b) <= eps; }

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch(e) { console.error(`  ✗ ${name}\n    ${e.message}`); failed++; }
}

// ── Tests: calcIRPF ───────────────────────────────────────────────────────────
console.log('\ncalcIRPF');

test('zero income → zero tax', () => {
  assert.strictEqual(calcIRPF(0, TRAMOS_DEFAULT), 0);
});

test('income below first bracket threshold', () => {
  // 0–12450 at 19% → 12000*0.19 = 2280
  const result = calcIRPF(12000, TRAMOS_DEFAULT);
  assert.ok(approxEq(result, 12000*0.19), `expected ${12000*0.19}, got ${result}`);
});

test('income spanning two brackets (0–12450 @19%, 12450–20200 @24%)', () => {
  // full first bracket: 12450*0.19 = 2365.5
  // partial second:    (20000-12450)*0.24 = 7550*0.24 = 1812
  const expected = 12450*0.19 + 7550*0.24;
  const result = calcIRPF(20000, TRAMOS_DEFAULT);
  assert.ok(approxEq(result, expected), `expected ${expected}, got ${result}`);
});

test('custom single-rate tramo', () => {
  const result = calcIRPF(50000, [[0,20]]);
  assert.ok(approxEq(result, 10000), `expected 10000, got ${result}`);
});

// ── Tests: retencionMensual ───────────────────────────────────────────────────
console.log('\nretencionMensual');

test('monthly retention = annual IRPF / 12', () => {
  const anual = calcIRPF(30000, TRAMOS_DEFAULT);
  const mensual = retencionMensual(30000, TRAMOS_DEFAULT);
  assert.ok(approxEq(mensual, anual/12), `expected ${anual/12}, got ${mensual}`);
});

test('zero salary → zero monthly retention', () => {
  assert.strictEqual(retencionMensual(0, TRAMOS_DEFAULT), 0);
});

// ── Tests: proyectarRetencionesFiscales ───────────────────────────────────────
console.log('\nproyectarRetencionesFiscales');

const BASE_CONFIG = { tramos_irpf: TRAMOS_DEFAULT };
const DATE_START = '2026-01-01';
const DATE_END   = '2026-12-31';

const INCOME_SIMPLE = {
  _id: 'inc1', activo: true, tipo: 'ingreso', sujetoIRPF: false,
  concepto: 'Nómina neta', cuantia: 2000, frecuencia: 1,
  tipoFrecuencia: 'mensual', fechaInicio: '2026-01-01', fechaFin: null,
  cuenta: 'default', tags: [], diaPago: ''
};

const INCOME_IRPF = {
  _id: 'inc2', activo: true, tipo: 'ingreso', sujetoIRPF: true,
  concepto: 'Nómina bruta', cuantia: 3000, frecuencia: 1,
  tipoFrecuencia: 'mensual', fechaInicio: '2026-01-01', fechaFin: null,
  cuenta: 'default', tags: [], diaPago: ''
};

test('simplified income (sujetoIRPF=false) generates no IRPF events', () => {
  const evs = proyectarRetencionesFiscales([INCOME_SIMPLE], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(evs.length, 0);
});

test('inactive income generates no IRPF events', () => {
  const evs = proyectarRetencionesFiscales([{...INCOME_IRPF, activo:false}], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(evs.length, 0);
});

test('non-income entry generates no IRPF events', () => {
  const evs = proyectarRetencionesFiscales([{...INCOME_IRPF, tipo:'gasto'}], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(evs.length, 0);
});

test('detailed income generates 12 monthly IRPF expense events for full year', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(evs.length, 12);
});

test('IRPF events have correct concepto', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END);
  assert.ok(evs.every(e => e.concepto === 'IRPF salario Nómina bruta'), `got: ${evs[0]?.concepto}`);
});

test('IRPF events have tipo=gasto', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END);
  assert.ok(evs.every(e => e.tipo === 'gasto'));
});

test('IRPF events have correct monthly retention amount', () => {
  const salarioAnual = INCOME_IRPF.cuantia * 12; // 36000
  const expectedRet = retencionMensual(salarioAnual, TRAMOS_DEFAULT);
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END);
  assert.ok(evs.every(e => approxEq(e.cuantia, expectedRet)), `expected ${expectedRet}, got ${evs[0]?.cuantia}`);
});

test('IRPF events include irpf and fiscal tags', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END);
  assert.ok(evs.every(e => e.tags.includes('irpf') && e.tags.includes('fiscal')));
});

test('filtroAccounts=[] (no filter) → events generated', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END, []);
  assert.strictEqual(evs.length, 12);
});

test('filtroAccounts excluding income account → no IRPF events', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END, ['other-account']);
  assert.strictEqual(evs.length, 0);
});

test('filtroAccounts including income account → IRPF events generated', () => {
  const evs = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END, ['default']);
  assert.strictEqual(evs.length, 12);
});

test('extraordinary income generates one IRPF event', () => {
  const oneShot = { ...INCOME_IRPF, tipoFrecuencia: 'extraordinario', fechaInicio: '2026-06-01' };
  const evs = proyectarRetencionesFiscales([oneShot], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(evs.length, 1);
  assert.strictEqual(evs[0].fecha, '2026-06-01');
});

test('income outside date range generates no IRPF events', () => {
  const future = { ...INCOME_IRPF, fechaInicio: '2027-01-01' };
  const evs = proyectarRetencionesFiscales([future], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(evs.length, 0);
});

// ── Integration: both income and IRPF present in same output set ──────────────
console.log('\nIntegration');

test('detailed income: direct events are ingreso, IRPF events are gasto', () => {
  const incomeEvents = proyectarGastos([INCOME_IRPF], DATE_START, DATE_END);
  const irpfEvents   = proyectarRetencionesFiscales([INCOME_IRPF], BASE_CONFIG, DATE_START, DATE_END);
  assert.strictEqual(incomeEvents.length, 12);
  assert.strictEqual(irpfEvents.length, 12);
  assert.ok(incomeEvents.every(e => e.tipo === 'ingreso'));
  assert.ok(irpfEvents.every(e => e.tipo === 'gasto'));
});

test('net cash per month = cuantia - IRPF retention', () => {
  const salarioAnual = INCOME_IRPF.cuantia * 12;
  const ret = retencionMensual(salarioAnual, TRAMOS_DEFAULT);
  const net = INCOME_IRPF.cuantia - ret;
  assert.ok(net > 0, 'net salary should be positive');
  assert.ok(net < INCOME_IRPF.cuantia, 'net salary should be less than gross');
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
