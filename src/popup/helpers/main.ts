export const bg = window["chrome"].extension.getBackgroundPage();

export function log(...args) {
    bg.log(...args);
}

export function closeWindow() {
    window.close();
}
