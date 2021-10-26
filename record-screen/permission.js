navigator.webkitGetUserMedia(
  { video: true, audio: true },
  () => {
    window.close();
  },
  (e) => {
    console.error(e.message);
  }
);
