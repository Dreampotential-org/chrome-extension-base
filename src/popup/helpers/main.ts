export const bg = window["chrome"].extension.getBackgroundPage() as Window & {
  log: Function;
  execCommand: (command: ExecCommand, props?: { [x: string]: any }) => any;
  execCommandAsync: (command: ExecCommand, props: { [x: string]: any }, cb: (result: any) => any) => any;
};

export function log(...args) {
  bg.log(...args);
}

export function closeWindow() {
  window.close();
}
