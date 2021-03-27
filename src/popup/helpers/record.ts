import { bg } from "./main";

export function startRecording() {
    bg.record();
}

export function stopRecording() {
    bg.cut();
}

export function cancelUpload() {
    bg.abortUpload();
}

export function download() {
    const blob = bg.downloadLastRecorded();
    if (blob) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${new Date().getTime()}.webm`;
        a.click();
    }
    return;
}

export const recordingOptions = {
    get(): RecordOptions {
        return bg.getRecordingOptions();
    },
    set(audio: boolean | RecordOptionsAudio) {
        return bg.setRecordingOptions({
            video: true,
            audio
        });
    }
}
