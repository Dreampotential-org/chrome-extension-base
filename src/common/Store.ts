import { writable, get } from "svelte/store";

export default class Store {
    set: (value) => void;
    update: (updater) => void;
    subscribe: (callback: Function) => Function;

    constructor(value) {
        const { set, update, subscribe } = writable(value);
        this.set = set;
        this.update = update;
        this.subscribe = subscribe;
    }

    get() {
        return get(<any>this);
    }
}