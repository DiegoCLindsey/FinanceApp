import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseComponent } from './BaseComponent';
import { Store } from './store';

// ── Test subclass ─────────────────────────────────────────────────────────────

class TestWidget extends BaseComponent {
  renderCount = 0;
  afterRenderCount = 0;

  protected template(): string {
    this.renderCount++;
    return `<span data-testid="content">widget</span>`;
  }

  protected override afterRender(): void {
    this.afterRenderCount++;
  }

  // Expose protected methods for testing
  publicInvalidate(): void {
    this.invalidate();
  }
  publicEmit<T>(name: string, detail?: T): boolean {
    return this.emit(name, detail);
  }
  publicOn(
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
    target?: EventTarget
  ): void {
    this.on(type, handler, options, target);
  }
  publicConnectStore<T extends object>(store: Store<T>): void {
    this.connectStore(store);
  }
  publicQs<E extends Element = Element>(selector: string): E | null {
    return this.qs<E>(selector);
  }
  publicQsa<E extends Element = Element>(selector: string): NodeListOf<E> {
    return this.qsa<E>(selector);
  }
}

customElements.define('test-widget', TestWidget);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Resolves all pending microtasks (one Promise.resolve tick). */
const flushMicrotasks = (): Promise<void> => Promise.resolve();

function mount(): TestWidget {
  const el = document.createElement('test-widget') as TestWidget;
  document.body.appendChild(el);
  return el;
}

function unmount(el: TestWidget): void {
  el.remove();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('BaseComponent', () => {
  let el: TestWidget;

  beforeEach(() => {
    document.body.innerHTML = '';
    el = mount();
  });

  // Render lifecycle
  it('renders template on connectedCallback', () => {
    expect(el.renderCount).toBe(1);
    expect(el.innerHTML).toContain('widget');
  });

  it('calls afterRender after connectedCallback', () => {
    expect(el.afterRenderCount).toBe(1);
  });

  it('qs finds a child element by selector', () => {
    const span = el.publicQs('[data-testid="content"]');
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe('widget');
  });

  it('qsa returns all matching elements', () => {
    const spans = el.publicQsa('span');
    expect(spans.length).toBe(1);
  });

  // invalidate
  it('invalidate schedules a re-render on the next microtask', async () => {
    const before = el.renderCount;
    el.publicInvalidate();
    await flushMicrotasks();
    expect(el.renderCount).toBe(before + 1);
  });

  it('multiple invalidate calls before microtask fires cause only one render', async () => {
    const before = el.renderCount;
    el.publicInvalidate();
    el.publicInvalidate();
    el.publicInvalidate();
    await flushMicrotasks();
    expect(el.renderCount).toBe(before + 1);
  });

  it('calls afterRender after invalidate-triggered re-render', async () => {
    const before = el.afterRenderCount;
    el.publicInvalidate();
    await flushMicrotasks();
    expect(el.afterRenderCount).toBe(before + 1);
  });

  // Store subscription
  it('re-renders when connected store emits', async () => {
    const store = new Store({ value: 0 }, 'test-widget-store');
    el.publicConnectStore(store);
    const before = el.renderCount;
    store.setState({ value: 1 });
    await flushMicrotasks();
    expect(el.renderCount).toBeGreaterThan(before);
  });

  it('stops listening to store after disconnect', async () => {
    const store = new Store({ value: 0 }, 'test-widget-store-2');
    el.publicConnectStore(store);
    unmount(el);
    const countAfterUnmount = el.renderCount;
    store.setState({ value: 99 });
    await flushMicrotasks();
    expect(el.renderCount).toBe(countAfterUnmount);
  });

  // DOM event listeners
  it('on registers a listener that fires on the host element', () => {
    const handler = vi.fn();
    el.publicOn('click', handler);
    el.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('on with custom target registers on that target', () => {
    const handler = vi.fn();
    const div = document.createElement('div');
    el.publicOn('click', handler, undefined, div);
    div.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('on listeners are removed after disconnect', () => {
    const handler = vi.fn();
    el.publicOn('click', handler);
    unmount(el);
    el.dispatchEvent(new MouseEvent('click'));
    expect(handler).not.toHaveBeenCalled();
  });

  // emit
  it('emit dispatches a CustomEvent that bubbles and is composed', () => {
    const handler = vi.fn();
    document.body.addEventListener('test-event', handler);
    el.publicEmit('test-event', { x: 1 });
    expect(handler).toHaveBeenCalledOnce();
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ x: 1 });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    document.body.removeEventListener('test-event', handler);
  });

  it('emit returns true for a non-cancelled event', () => {
    expect(el.publicEmit('uncancelled-event')).toBe(true);
  });

  // disconnectedCallback cleanup
  it('does not render after disconnect even if invalidate was pending', async () => {
    el.publicInvalidate();
    const countBeforeDisconnect = el.renderCount;
    unmount(el);
    await flushMicrotasks();
    expect(el.renderCount).toBe(countBeforeDisconnect);
  });

  it('clears subscriptions on disconnect', async () => {
    const store = new Store({ value: 0 }, 'test-cleanup-store');
    el.publicConnectStore(store);
    unmount(el);
    const countAfterUnmount = el.renderCount;
    store.setState({ value: 42 });
    await flushMicrotasks();
    expect(el.renderCount).toBe(countAfterUnmount);
  });
});
