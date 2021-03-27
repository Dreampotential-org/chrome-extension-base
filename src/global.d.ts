interface RecordOptionsAudio {
    echoCancellation: boolean;
    noiseSuppression: boolean;
}

interface RecordOptions {
    video: boolean;
    audio: boolean | RecordOptionAudio;
}

interface Background {
    log: (...args) => undefined;
    startRecording: Function;
    stopRecording: Function;
    handleData: Function;
    setRecordingOptions: (options: RecordOptions) => any;
    getRecordingOption: () => RecordOptions;
}