import Store from "../common/Store";

export const STATUS_KEY = "STATUS_CODE";
export const OPTIONS_KEY = "RECORDING_OPTIONS";
export const UPLOADS_KEY = "UPLOADS";
export const SERVER = "https://sfapp-api.dreamstate-4-all.org/";

export const blob = new Store(null);
export const recorder = new Store(null);
export const statusCode = new Store(parseInt(localStorage.getItem(STATUS_KEY) || "0"));
export const mediaStream = new Store(null);
export const uploadController = new Store(null);
export const recordOptions = new Store(JSON.parse(localStorage.getItem(OPTIONS_KEY)) || {
    video: true,
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
    }
});

export const uploads = new Store(JSON.parse(localStorage.getItem(UPLOADS_KEY) || "[]"));

uploads.subscribe(uploads => {
    if (uploads instanceof Array) {
        localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));
    }
});

statusCode.subscribe(code => {
    if (typeof code !== "undefined") {
        localStorage.setItem(STATUS_KEY, code);
    }
})

recordOptions.subscribe(options => {
    if (options) {
        localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
    } else {
        recordOptions.set({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true
            }
        });
    }
});
