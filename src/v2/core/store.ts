import type { AppState, AppConfig, Loan, Expense, Account, Goal } from '@/types/domain';

// ── Default state ─────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: AppConfig = {
  dashboardStart: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
  dashboardEnd: new Date(new Date().getFullYear(), 11, 31).toISOString().slice(0, 10),
  colchonMeses: 3,
  colchonTipo: 'meses',
  colchonFijo: 0,
  showColchon: true,
  showHistorico: false,
  histCuenta: '',
  showMC: false,
  mcIteraciones: 1000,
  inflacionGlobal: 2.5,
  tramos_irpf: [
    [0, 19],
    [12450, 24],
    [20200, 30],
    [35200, 37],
    [60000, 45],
    [300000, 47],
  ],
  onboardingDone: false,
  showExecSummary: false,
  showCriticos: true,
  divisaBase: 'EUR',
  locale: 'es',
  theme: 'dark',
  presupuestos: [],
};

const EMPTY_STATE: AppState = {
  loans: [],
  expenses: [],
  accounts: [],
  goals: [],
  config: DEFAULT_CONFIG,
};

// ── Subscriber type ───────────────────────────────────────────────────────────

type Subscriber<T> = (state: T) => void;
type Unsubscribe = () => void;

// ── Store implementation ──────────────────────────────────────────────────────

export class Store<T extends object> {
  private state: T;
  private subscribers = new Set<Subscriber<T>>();
  private readonly storageKey: string;

  constructor(initialState: T, storageKey: string) {
    this.storageKey = storageKey;
    this.state = this.load() ?? initialState;
  }

  getState(): Readonly<T> {
    return this.state;
  }

  setState(patch: Partial<T>): void {
    this.state = { ...this.state, ...patch };
    this.persist();
    this.notify();
  }

  /**
   * Applies a functional update — receives the current state and returns a
   * new partial to merge in. Use this when the update depends on current state.
   */
  update(updater: (current: Readonly<T>) => Partial<T>): void {
    this.setState(updater(this.state));
  }

  subscribe(fn: Subscriber<T>): Unsubscribe {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  /** Replaces the entire state (e.g. after import). Triggers notification. */
  reset(state: T): void {
    this.state = state;
    this.persist();
    this.notify();
  }

  /** Clears persisted storage and resets to the provided initial state. */
  clear(initialState: T): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // localStorage unavailable (SSR / test environment)
    }
    this.state = initialState;
    this.notify();
  }

  private notify(): void {
    for (const fn of this.subscribers) {
      fn(this.state);
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
      // Quota exceeded or unavailable — silent fail
    }
  }

  private load(): T | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}

// ── App-level store singleton ─────────────────────────────────────────────────

export const STORAGE_KEY = 'financeapp_v2_state';

export const appStore = new Store<AppState>(EMPTY_STATE, STORAGE_KEY);

// ── Typed selectors ──────────────────────────────────────────────────────────

export function selectLoans(): Loan[] {
  return appStore.getState().loans;
}

export function selectActiveLoans(): Loan[] {
  return appStore.getState().loans.filter((l) => l.activo && !l.simulacion);
}

export function selectExpenses(): Expense[] {
  return appStore.getState().expenses;
}

export function selectActiveExpenses(): Expense[] {
  return appStore.getState().expenses.filter((e) => e.activo && !e.frecuencia);
}

export function selectAccounts(): Account[] {
  return appStore.getState().accounts;
}

export function selectActiveAccounts(): Account[] {
  return appStore.getState().accounts.filter((a) => a.activo && !a.simulacion);
}

export function selectGoals(): Goal[] {
  return appStore.getState().goals;
}

export function selectConfig(): AppConfig {
  return appStore.getState().config;
}

// ── Typed mutators ────────────────────────────────────────────────────────────

export function upsertLoan(loan: Loan): void {
  appStore.update(({ loans }) => ({
    loans: loans.some((l) => l._id === loan._id)
      ? loans.map((l) => (l._id === loan._id ? loan : l))
      : [...loans, loan],
  }));
}

export function deleteLoan(id: string): void {
  appStore.update(({ loans }) => ({ loans: loans.filter((l) => l._id !== id) }));
}

export function upsertExpense(expense: Expense): void {
  appStore.update(({ expenses }) => ({
    expenses: expenses.some((e) => e._id === expense._id)
      ? expenses.map((e) => (e._id === expense._id ? expense : e))
      : [...expenses, expense],
  }));
}

export function deleteExpense(id: string): void {
  appStore.update(({ expenses }) => ({ expenses: expenses.filter((e) => e._id !== id) }));
}

export function upsertAccount(account: Account): void {
  appStore.update(({ accounts }) => ({
    accounts: accounts.some((a) => a._id === account._id)
      ? accounts.map((a) => (a._id === account._id ? account : a))
      : [...accounts, account],
  }));
}

export function deleteAccount(id: string): void {
  appStore.update(({ accounts }) => ({ accounts: accounts.filter((a) => a._id !== id) }));
}

export function upsertGoal(goal: Goal): void {
  appStore.update(({ goals }) => ({
    goals: goals.some((g) => g._id === goal._id)
      ? goals.map((g) => (g._id === goal._id ? goal : g))
      : [...goals, goal],
  }));
}

export function deleteGoal(id: string): void {
  appStore.update(({ goals }) => ({ goals: goals.filter((g) => g._id !== id) }));
}

export function updateConfig(patch: Partial<AppConfig>): void {
  appStore.update(({ config }) => ({ config: { ...config, ...patch } }));
}
