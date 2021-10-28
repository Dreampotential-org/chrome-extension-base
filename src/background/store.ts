import Store from "../common/Store";

export const status = new Store("idle");
export const currentStream = new Store<MediaStream>();
export const list = new Store<Array<ListItem>>(
  JSON.parse(localStorage.getItem("recorded_sessions")) || []
);

const defaultSettings = {
  diskQuote: 40 * 1024 ** 3, // 40 GB
  videoWidth: 0,
};

export const settings = new Store<Settings>(
  JSON.parse(localStorage.getItem("settings")) || defaultSettings
);

list.subscribe((updatedList) => {
  localStorage.setItem("recorded_sessions", JSON.stringify(updatedList));
});

settings.subscribe((settings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
});
