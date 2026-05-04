import { Store } from './store';

// ── Types ─────────────────────────────────────────────────────────────────────

type Unsubscribe = () => void;

// ── BaseComponent ─────────────────────────────────────────────────────────────

/**
 * Abstract base class for V2 Web Components.
 *
 * Responsibilities:
 * - Declarative render cycle: subclasses implement `template()` returning an
 *   HTML string; `invalidate()` schedules a batched re-render via a microtask,
 *   coalescing multiple synchronous state changes into a single DOM update.
 * - Store subscriptions: `connectStore()` registers a store listener that
 *   automatically calls `invalidate()` and is cleaned up on disconnect.
 * - DOM event delegation: `on()` registers listeners on the host (or a custom
 *   target) and removes them all on disconnect.
 * - Typed custom event dispatch: `emit()` dispatches a bubbling, composed
 *   CustomEvent with optional detail.
 */
export abstract class BaseComponent extends HTMLElement {
  private _subscriptions: Unsubscribe[] = [];
  private _domListeners: Array<{
    target: EventTarget;
    type: string;
    handler: EventListenerOrEventListenerObject;
    options?: AddEventListenerOptions;
  }> = [];
  private _renderPending = false;
  private _mounted = false;

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  connectedCallback(): void {
    this._mounted = true;
    this.render();
    this.afterRender();
  }

  disconnectedCallback(): void {
    this._mounted = false;
    // _mounted flag prevents the pending microtask from rendering
    this._renderPending = false;
    for (const unsub of this._subscriptions) unsub();
    this._subscriptions = [];
    for (const { target, type, handler, options } of this._domListeners) {
      target.removeEventListener(type, handler, options);
    }
    this._domListeners = [];
  }

  // ── Render cycle ────────────────────────────────────────────────────────────

  /** Returns the HTML string for this component's content. */
  protected abstract template(): string;

  /** Called after every render — override to attach imperative listeners. */
  protected afterRender(): void {}

  /**
   * Schedules a re-render on the next microtask tick, batching multiple
   * synchronous calls into a single DOM update.
   */
  protected invalidate(): void {
    if (!this._mounted || this._renderPending) return;
    this._renderPending = true;
    Promise.resolve().then(() => {
      this._renderPending = false;
      if (this._mounted) {
        this.render();
        this.afterRender();
      }
    });
  }

  private render(): void {
    this.innerHTML = this.template();
  }

  // ── Store binding ─────────────────────────────────────────────────────────

  /**
   * Subscribes to a Store. The component is invalidated whenever the store
   * emits. The subscription is automatically cleaned up on disconnect.
   */
  protected connectStore<T extends object>(store: Store<T>): void {
    const unsub = store.subscribe(() => this.invalidate());
    this._subscriptions.push(unsub);
  }

  // ── DOM event helpers ─────────────────────────────────────────────────────

  /**
   * Registers an event listener on `target` (defaults to `this`) and
   * schedules its removal when the component disconnects.
   */
  protected on<K extends keyof HTMLElementEventMap>(
    type: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void;
  protected on(
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
    target?: EventTarget
  ): void;
  protected on(
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
    target: EventTarget = this
  ): void {
    target.addEventListener(type, handler, options);
    this._domListeners.push({ target, type, handler, options });
  }

  // ── Custom event dispatch ─────────────────────────────────────────────────

  /**
   * Dispatches a CustomEvent that bubbles and crosses shadow DOM boundaries.
   * Returns false if the event was cancelled.
   */
  protected emit<T = unknown>(eventName: string, detail?: T): boolean {
    return this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  // ── Utility ──────────────────────────────────────────────────────────────

  /** Queries the component's DOM for a typed element; returns null if absent. */
  protected qs<E extends Element = Element>(selector: string): E | null {
    return this.querySelector<E>(selector);
  }

  protected qsa<E extends Element = Element>(selector: string): NodeListOf<E> {
    return this.querySelectorAll<E>(selector);
  }
}
