
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { n as noop, s as safe_not_equal, E as get_store_value } from './index-ac68a7eb.js';

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

class Store {
    constructor(value = undefined) {
        const { set, update, subscribe } = writable(value);
        this.set = set;
        this.update = update;
        this.subscribe = subscribe;
    }
    get() {
        return get_store_value(this);
    }
}

const status = new Store("idle");
const list = new Store(JSON.parse(localStorage.getItem("recorded_sessions")) || []);
list.subscribe((updatedList) => {
    localStorage.setItem("recorded_sessions", JSON.stringify(updatedList));
});

class Storage {
    constructor(quote) {
        this.quote = quote;
    }
    init() {
        return new Promise((resolve, reject) => {
            window["webkitRequestFileSystem"](1, this.quote, (fs) => {
                this.fs = fs;
                resolve(this);
            }, (error) => {
                reject(error);
            });
        });
    }
    write(blob, filename = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)) {
        return new Promise((resolve, reject) => {
            this.fs.root.getFile(filename, { create: true, exclusive: true }, function (entry) {
                entry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        resolve(filename);
                    };
                    fileWriter.onerror = function (e) {
                        reject(new Error(e.message));
                    };
                    fileWriter.write(blob);
                }, console.error);
            }, console.error);
        });
    }
    read(filename) {
        return new Promise((resolve, reject) => {
            this.fs.root.getFile(filename, {}, function (entry) {
                entry.file(async function (file) {
                    const buffer = await file.arrayBuffer();
                    resolve(new Blob([buffer]));
                }, (e) => reject(e.message));
            }, (e) => reject(e.message));
            return new Blob([]);
        });
    }
    remove(filename) {
        return new Promise((resolve, reject) => {
            this.fs.root.getFile(filename, { create: false }, function (fileEntry) {
                fileEntry.remove(function () {
                    resolve(true);
                }, (e) => reject(e.message));
            }, (e) => reject(e.message));
        });
    }
}

window["log"] = function () {
    console.log(...arguments);
};
let currentStream;
let record = undefined;
let mic = false;
let storage = new Storage(20 * 1024 ** 3);
storage.init();
window["storage"] = storage;
window["execCommand"] = function (command, options = {}) {
    switch (command) {
        case "GET_STATUS":
            return getStatus();
        case "START_REC":
            return startRecording();
        case "STOP_REC":
            return stopRecording(currentStream);
        case "GET_LIST":
            return list.get();
        case "RENAME_ITEM":
            list.update((list) => {
                const itemIndex = list.findIndex((item) => item.id === options.id);
                if (itemIndex > -1) {
                    list[itemIndex].name = options.name;
                }
                return list;
            });
            return list;
        case "DELETE_ITEM":
            storage.remove(options.id).then((result) => {
                list.update((list) => {
                    return list.filter((item) => item.id !== options.id);
                });
            });
            return;
        case "DOWNLOAD_ITEM": {
            const id = options.id;
            const item = list.get().find((item) => item.id === id);
            storage.read(id).then(async (blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = item.name;
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 10000);
            });
            return;
        }
        case "UPLOAD_ITEM":
            return;
        case "PLAY_ITEM": {
            const id = options.id;
            list.get().find((item) => item.id === id);
            storage.read(id).then(async (blob) => {
                const url = URL.createObjectURL(new File([blob], "video.webm"));
                window["chrome"].tabs.create({ url: `play.html#${url}` });
            });
            return;
        }
        case "UNMUTE":
            mic = true;
            return;
        case "MUTE":
            mic = false;
            return;
        case "GET_MUTE":
            return mic;
    }
};
function getStatus() {
    return status.get();
}
async function startRecording(audio = !!mic) {
    try {
        if (getStatus() !== "idle")
            return { error: "STATUS NOT IDLE" };
        const name = `record_${new Date().getTime()}.webm`;
        record = { id: name, name, created_at: new Date().getTime() };
        const screenStream = await navigator.mediaDevices["getDisplayMedia"]({
            video: true,
            audio: !!audio,
        });
        let videoTracks = screenStream.getVideoTracks();
        let audioTracks = screenStream.getAudioTracks();
        if (!!audio) {
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: !!audio,
            });
            audioTracks = micStream.getAudioTracks();
        }
        const finalStream = new MediaStream([...audioTracks, ...videoTracks]);
        status.set("recording");
        currentStream = finalStream;
        const recorder = new window["MediaRecorder"](finalStream, {
            mimeType: "video/webm; codecs=vp9",
        });
        recorder.start();
        recorder.ondataavailable = async ({ data: blob }) => {
            await storage.write(blob, name);
        };
        // handle stop recording
        const track = screenStream.getVideoTracks()[0];
        track.addEventListener("ended", () => {
            stopRecording(finalStream);
            stopRecording(screenStream);
        });
        return name;
    }
    catch (error) {
        return console.log("Error:", error.message);
    }
}
function stopRecording(stream) {
    stream.getTracks().forEach((track) => {
        track.stop();
    });
    onStop();
}
function onStop() {
    status.set("idle");
    list.update((list) => {
        if (!list.find((item) => item.id === record.id))
            list.push(record);
        return list;
    });
}
//# sourceMappingURL=background.js.map
