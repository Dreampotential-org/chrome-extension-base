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
    | "GET_MUTE"
    | "GET_SETTINGS"
    | "SET_SETTINGS"
    | "GET_UPLOAD_PROGRESS"
    | "COPY_URL";

  interface ListItem {
    id: string;
    name: string;
    created_at: number;
  }

  interface Settings {
    diskQuote: number;
    videoWidth: number;
  }

  interface UploadStatus {
    [id: string]: number;
  }
}
