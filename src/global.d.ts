export declare global {
  type ExecCommand =
    | "GET_STATUS"
    | "START_REC"
    | "STOP_REC"
    | "GET_LIST"
    | "DELETE_ITEM"
    | "RENAME_ITEM"
    | "DOWNLOAD_ITEM"
    | "UPLOAD_ITEM"
    | "PLAY_ITEM"
    | "UNMUTE"
    | "MUTE"
    | "GET_MUTE";

  interface ListItem {
    id: string;
    name: string;
    created_at: number;
  }
}
