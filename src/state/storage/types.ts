// Contrato de persistencia. El store no sabe si detrás hay localStorage,
// Firestore o un fichero: solo lee y escribe claves.

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void | Promise<void>;
  remove(key: string): void | Promise<void>;
  keys(): string[];
}
