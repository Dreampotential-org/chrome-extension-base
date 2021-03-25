import { writable } from "svelte/store";

const OPTIONS_KEY = "recordingOptions";

export const mediaStream = writable(null);

export const recording = writable(false);
export const recorder = writable(null);
export const recorded = writable(null);

export const recordingOptions = writable(JSON.parse(localStorage.getItem(OPTIONS_KEY)));

recordingOptions.subscribe(options => {
    if (options) {
        localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
    } else {
        recordingOptions.set({
            video: true,
            audio: true
        });
    }
});
