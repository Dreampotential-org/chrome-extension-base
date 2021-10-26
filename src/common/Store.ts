import { writable, get } from "svelte/store";

export default class Store<T> {
  set: (value: T) => void;
  update: (updater: (value: T) => T) => void;
  subscribe: (callback: (value: T) => void) => Function;

  constructor(value: T = undefined) {
    const { set, update, subscribe } = writable<T>(value);
    this.set = set;
    this.update = update;
    this.subscribe = subscribe;
  }

  get(): T {
    return get(<any>this);
  }
}
