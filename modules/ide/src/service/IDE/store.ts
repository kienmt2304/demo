import type { TerminalEventChanges, TerminalSubscriberFN } from "./type";

export class TerminalStore {
  #store: Map<string, Record<string, string>>;
  #subscribers: Map<string, Set<TerminalSubscriberFN>>;

  constructor() {
    this.#store = new Map();
    this.#subscribers = new Map();
  }

  get(key: string) {
    return this.#store.get(key);
  }

  #set(key: string, value: Record<string, string>) {
    this.#store.set(key, {
      ...this.#store.get(key),
      ...value,
    });
  }

  subscribe(key: string, fn: TerminalSubscriberFN) {
    if (!this.#subscribers.has(key)) this.#subscribers.set(key, new Set());
    this.#subscribers.get(key)?.add(fn);
    return () => this.unsubscribe(key, fn);
  }

  unsubscribe(key: string, fn: TerminalSubscriberFN) {
    if (!this.#subscribers.has(key)) return;
    this.#subscribers.get(key)?.delete(fn);
  }

  emit(key: string, args: TerminalEventChanges) {
    this.#set(key, args.changes ?? {});
    [...(this.#subscribers.get(key) ?? new Set())].forEach((fn) => fn(args));
  }
}

const terminalStore = new TerminalStore();

export default terminalStore;
