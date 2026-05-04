import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  Store,
  appStore,
  STORAGE_KEY,
  selectLoans,
  selectActiveLoans,
  selectConfig,
  upsertLoan,
  deleteLoan,
  upsertExpense,
  deleteExpense,
  upsertAccount,
  deleteAccount,
  upsertGoal,
  deleteGoal,
  updateConfig,
} from './store';
import {
  loanFactory,
  expenseFactory,
  accountFactory,
  goalFactory,
  configFactory,
} from '@/test-utils/factories';
// ── Store<T> unit tests ───────────────────────────────────────────────────────

describe('Store', () => {
  let store: Store<{ count: number; label: string }>;

  beforeEach(() => {
    localStorage.clear();
    store = new Store({ count: 0, label: 'hello' }, 'test-store');
  });

  it('initialises with the provided initial state when localStorage is empty', () => {
    expect(store.getState().count).toBe(0);
    expect(store.getState().label).toBe('hello');
  });

  it('setState merges a partial update', () => {
    store.setState({ count: 5 });
    expect(store.getState().count).toBe(5);
    expect(store.getState().label).toBe('hello');
  });

  it('update applies a functional update based on current state', () => {
    store.setState({ count: 3 });
    store.update(({ count }) => ({ count: count + 1 }));
    expect(store.getState().count).toBe(4);
  });

  it('notifies subscribers on setState', () => {
    const listener = vi.fn();
    store.subscribe(listener);
    store.setState({ count: 1 });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
  });

  it('unsubscribe removes the listener', () => {
    const listener = vi.fn();
    const unsub = store.subscribe(listener);
    unsub();
    store.setState({ count: 99 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('notifies multiple independent subscribers', () => {
    const a = vi.fn();
    const b = vi.fn();
    store.subscribe(a);
    store.subscribe(b);
    store.setState({ count: 2 });
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  it('persists state to localStorage on setState', () => {
    store.setState({ count: 42 });
    const stored = JSON.parse(localStorage.getItem('test-store')!);
    expect(stored.count).toBe(42);
  });

  it('rehydrates from localStorage on construction', () => {
    localStorage.setItem('test-store', JSON.stringify({ count: 7, label: 'restored' }));
    const s2 = new Store({ count: 0, label: 'hello' }, 'test-store');
    expect(s2.getState().count).toBe(7);
  });

  it('reset replaces the entire state', () => {
    store.setState({ count: 10 });
    store.reset({ count: 99, label: 'new' });
    expect(store.getState().count).toBe(99);
  });

  it('clear removes persisted data and uses provided initial state', () => {
    store.setState({ count: 5 });
    store.clear({ count: 0, label: 'hello' });
    expect(store.getState().count).toBe(0);
    expect(localStorage.getItem('test-store')).toBeNull();
  });

  it('returns null from load when stored JSON is malformed', () => {
    localStorage.setItem('test-store', 'not-json{{{');
    const s2 = new Store({ count: 0, label: 'hello' }, 'test-store');
    expect(s2.getState().count).toBe(0);
  });

  it('getState returns a readonly snapshot (not mutated by external changes)', () => {
    const snap = store.getState();
    store.setState({ count: 99 });
    // The old snapshot should still hold the old value
    expect(snap.count).toBe(0);
  });
});

// ── appStore & mutators ───────────────────────────────────────────────────────

describe('appStore mutators', () => {
  beforeEach(() => {
    localStorage.clear();
    appStore.clear({
      loans: [],
      expenses: [],
      accounts: [],
      goals: [],
      config: configFactory(),
    });
  });

  // Loans
  it('upsertLoan adds a new loan', () => {
    const loan = loanFactory();
    upsertLoan(loan);
    expect(selectLoans()).toHaveLength(1);
    expect(selectLoans()[0]._id).toBe(loan._id);
  });

  it('upsertLoan updates an existing loan', () => {
    const loan = loanFactory({ nombre: 'Original' });
    upsertLoan(loan);
    upsertLoan({ ...loan, nombre: 'Actualizado' });
    expect(selectLoans()).toHaveLength(1);
    expect(selectLoans()[0].nombre).toBe('Actualizado');
  });

  it('deleteLoan removes the loan by id', () => {
    const loan = loanFactory();
    upsertLoan(loan);
    deleteLoan(loan._id);
    expect(selectLoans()).toHaveLength(0);
  });

  it('selectActiveLoans excludes inactive and simulation loans', () => {
    upsertLoan(loanFactory({ activo: true, simulacion: false }));
    upsertLoan(loanFactory({ activo: false, simulacion: false }));
    upsertLoan(loanFactory({ activo: true, simulacion: true }));
    expect(selectActiveLoans()).toHaveLength(1);
  });

  // Expenses
  it('upsertExpense adds and updates expenses', () => {
    const expense = expenseFactory();
    upsertExpense(expense);
    expect(appStore.getState().expenses).toHaveLength(1);
    upsertExpense({ ...expense, concepto: 'Actualizado' });
    expect(appStore.getState().expenses[0].concepto).toBe('Actualizado');
  });

  it('deleteExpense removes by id', () => {
    const expense = expenseFactory();
    upsertExpense(expense);
    deleteExpense(expense._id);
    expect(appStore.getState().expenses).toHaveLength(0);
  });

  // Accounts
  it('upsertAccount adds and updates accounts', () => {
    const account = accountFactory();
    upsertAccount(account);
    expect(appStore.getState().accounts).toHaveLength(1);
    upsertAccount({ ...account, nombre: 'Nueva cuenta' });
    expect(appStore.getState().accounts[0].nombre).toBe('Nueva cuenta');
  });

  it('deleteAccount removes by id', () => {
    const account = accountFactory();
    upsertAccount(account);
    deleteAccount(account._id);
    expect(appStore.getState().accounts).toHaveLength(0);
  });

  // Goals
  it('upsertGoal adds and updates goals', () => {
    const goal = goalFactory();
    upsertGoal(goal);
    expect(appStore.getState().goals).toHaveLength(1);
    upsertGoal({ ...goal, nombre: 'Meta actualizada' });
    expect(appStore.getState().goals[0].nombre).toBe('Meta actualizada');
  });

  it('deleteGoal removes by id', () => {
    const goal = goalFactory();
    upsertGoal(goal);
    deleteGoal(goal._id);
    expect(appStore.getState().goals).toHaveLength(0);
  });

  // Config
  it('updateConfig merges config patch', () => {
    updateConfig({ locale: 'en', colchonMeses: 6 });
    const cfg = selectConfig();
    expect(cfg.locale).toBe('en');
    expect(cfg.colchonMeses).toBe(6);
  });

  it('updateConfig preserves untouched config fields', () => {
    const before = selectConfig().divisaBase;
    updateConfig({ locale: 'en' });
    expect(selectConfig().divisaBase).toBe(before);
  });
});

// ── appStore STORAGE_KEY is correct ──────────────────────────────────────────

describe('STORAGE_KEY', () => {
  it('is the expected key for V2 state', () => {
    expect(STORAGE_KEY).toBe('financeapp_v2_state');
  });
});
