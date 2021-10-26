import { list, status } from "./store";
import Storage from "./Storage";

window["log"] = function () {
  console.log(...arguments);
};

let currentStream: MediaStream;
let record: ListItem = undefined;
let mic = false;

let storage = new Storage(20 * 1024 ** 3);
storage.init();
window["storage"] = storage;

window["execCommand"] = function (command: ExecCommand, options: any = {}) {
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
      const item = list.get().find((item) => item.id === id);
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

async function startRecording(audio: boolean = !!mic) {
  try {
    if (getStatus() !== "idle") return { error: "STATUS NOT IDLE" };

    const name = `record_${new Date().getTime()}.webm`;
    record = { id: name, name, created_at: new Date().getTime() };

    const screenStream: MediaStream = await navigator.mediaDevices[
      "getDisplayMedia"
    ]({
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
    recorder.ondataavailable = async ({ data: blob }: { data: Blob }) => {
      await storage.write(blob, name);
    };

    // handle stop recording
    const track = screenStream.getVideoTracks()[0];
    track.addEventListener("ended", () => {
      stopRecording(finalStream);
      stopRecording(screenStream);
    });
    return name;
  } catch (error) {
    return console.log("Error:", error.message);
  }
}

function stopRecording(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
  onStop();
}

function onStop() {
  status.set("idle");
  list.update((list) => {
    if (!list.find((item) => item.id === record.id)) list.push(record);
    return list;
  });
}
