import Store from "../common/Store";

export const status = new Store("idle");
export const currentStream = new Store<MediaStream>();
export const list = new Store<Array<ListItem>>(JSON.parse(localStorage.getItem("recorded_sessions")) || []);

list.subscribe((updatedList) => {
  localStorage.setItem("recorded_sessions", JSON.stringify(updatedList));
});

const defaultSettings = {
  diskQuote: 40 * 1024 ** 3,
  videoWidth: 0,
};

export const settings = new Store<Settings>(JSON.parse(localStorage.getItem("settings")) || defaultSettings);

settings.subscribe((settings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
});

export const uploadStatus = new Store<UploadStatus>(JSON.parse(localStorage.getItem("upload_status")) || {});

uploadStatus.subscribe((uploadStatus) => {
  localStorage.setItem("upload_status", JSON.stringify(uploadStatus));
});
