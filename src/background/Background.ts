import { NODE_SERVER } from "../common/env";
import { blob, mediaStream, recorder, statusCode, uploadController, uploads } from "./main.store";
import { recordOptions } from "./main.store";

export async function record() {
    if (statusCode.get() !== 0) return;
    let stream;
    try {
        stream = <MediaStream>await navigator.mediaDevices['getDisplayMedia'](recordOptions.get());
    } catch (error) {
        return console.log(error.message);
    }
    const tracks = [...stream.getTracks()];

    // Listen for ending tracks
    stream.getTracks().forEach(track => {
        track.addEventListener('ended', () => {
            const index = tracks.indexOf(track);
            tracks.splice(index, 1);
            if (!tracks.length) {
                cut();
            }
        })
    });

    // Record Stream
    const mediaRecorder = new window['MediaRecorder'](stream, { mimeType: "video/webm; codecs=vp9" });
    mediaRecorder.ondataavailable = onDataAvailabe;
    mediaRecorder.start();

    // Update State
    blob.set(null);
    mediaStream.set(stream);
    statusCode.set(1);
    recorder.set(mediaRecorder);
}

export function cut() {
    if (statusCode.get() === 1) {
        const stream = <MediaStream>mediaStream.get();
        const _recorder: any = recorder.get();
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            _recorder.stop();
        }
    }
    mediaStream.set(null);
    recorder.set(null);
}

export function auth() {
    return JSON.parse(localStorage.getItem("auth") || "null");
}

export async function upload(_blob: Blob) {
    const _auth = auth();
    if (!_auth) return console.log("not authenticated");
    try {
        console.log(_blob);
        statusCode.set(2);
        blob.set(_blob);
        const controller = new AbortController();
        const { signal } = controller;
        uploadController.set(controller);
        const formData = new FormData();
        formData.append('file', _blob);
        const response = await fetch(`${NODE_SERVER}/s3/files`, {
            method: 'POST',
            signal,
            body: formData,
        });
        const jsonResponse = await response.json();
        if (jsonResponse.url) {
            console.log("success");
            uploads.update(uploads => ([{ url: jsonResponse.url, at: new Date().getTime() }, ...uploads]));
        }
    } catch (error) {
        console.log(error.message);
    }
    statusCode.set(0);
}

export function abortUpload() {
    statusCode.set(0);
    const controller = <AbortController>uploadController.get();
    if (!controller) return;
    controller.abort();
}

export function onDataAvailabe(event) {
    if (event.data.size <= 0) return;
    upload(event.data);
}

export function setRecordingOptions(options: RecordOptions) {
    recordOptions.set(options);
}

export function getRecordingOptions(): RecordOptions {
    return <RecordOptions>recordOptions.get();
}

export function getStatusCode() {
    return statusCode.get();
}

export function downloadLastRecorded() {
    return blob.get();
}

export function log(...args) {
    console.log(...args);
}

export async function deleteUpload(url: string) {
    console.log("recieved command to delete", url);
    const _auth = auth();
    if (!_auth) return console.log("not authenticated");
    if (!url) return console.log("No url provided");
    try {
        const response = await fetch(`${NODE_SERVER}/s3/files`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                url
            })
        });
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            uploads.update(uploads => uploads.filter(file => file.url !== url));
        }
        return jsonResponse;
    } catch (error) {
        console.log(error.message);
    }
}