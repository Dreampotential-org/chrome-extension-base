import { get } from "svelte/store";
import { mediaStream, recorded, recorder, recording, recordingOptions } from "./background/main.store";

const define: any = {
    onMount,
    startRecording,
    stopRecording,
    isRecording,
    setRecordingOptions,
    getRecordingOptions
};

async function onMount() { }

function isRecording() {
    return get(recording);
}

define.log = function () {
    console.log(...arguments);
}

async function startRecording() {
    if (!isRecording()) {
        const options = get(recordingOptions);
        const stream: MediaStream = await navigator.mediaDevices['getDisplayMedia']({
            audio: options.audio,
            video: options.video
        });
        // 
        const tracks = [...stream.getTracks()];
        stream.getTracks().forEach(track => {
            track.addEventListener('ended', () => {
                const index = tracks.indexOf(track);
                tracks.splice(index, 1);
                if (!tracks.length) {
                    stopRecording();
                }
            })
        })
        stream.addEventListener('removetrack', () => {
            console.log("tracks", stream.getTracks());
        });
        // 
        const mediaRecorder = new window['MediaRecorder'](stream, { mimeType: "video/webm; codecs=vp9" });
        mediaRecorder.ondataavailable = handleData;
        mediaRecorder.start();
        // 
        recorded.set(null);
        mediaStream.set(stream);
        recording.set(true);
        recorder.set(mediaRecorder);
    } else {
        console.log("already recording");
    }
}

function handleData(event) {
    console.log("data-available");
    if (event.data.size > 0) {
        recorded.set(event.data);
        console.log(get(recorded));
    } else {
        // ...
    }
}


async function stopRecording() {
    if (isRecording()) {
        const stream: MediaStream = get(mediaStream);
        stream.getTracks().forEach(track => track.stop());
        get(recorder).stop();
    } else {
        console.log("not recording");
    }
    mediaStream.set(null);
    recording.set(false);
    recorder.set(null);
}

function setRecordingOptions(options = {}) {
    recordingOptions.set(options);
}

function getRecordingOptions() {
    const options = get(recordingOptions);
    return options;
}

window['chrome'].commands.onCommand.addListener(function (command) {
    if (command === "toggle-recording") {
        if (isRecording()) {
            stopRecording();
        } else {
            startRecording();
        }
    }
});

document.addEventListener('readystatechange', onMount);

for (const key in define) {
    window[key] = define[key];
}
