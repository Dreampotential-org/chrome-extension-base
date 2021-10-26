import Store from "../common/Store";

export const status = new Store("idle");
export const currentStream = new Store<MediaStream>();
export const list = new Store<Array<ListItem>>(
  JSON.parse(localStorage.getItem("recorded_sessions")) || []
);

list.subscribe((updatedList) => {
  localStorage.setItem("recorded_sessions", JSON.stringify(updatedList));
});
