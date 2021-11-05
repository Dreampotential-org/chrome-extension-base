const url = location.hash.slice(1);
if (url) {
  const video = document.createElement("video");
  video.autoplay = true;
  video.controls = true;
  video.src = url;
  document.body.appendChild(video);

  video.addEventListener('loadedmetadata', () => {
    if (video.duration === Infinity) {
      video.duration = Number.MAX_SAFE_INTEGER;
      video.currentTime = Number.MAX_SAFE_INTEGER;
      const interval = setInterval(checkCurrentTime, 3000);
      function checkCurrentTime() {
        if (interval !== Infinity) {
          video.currentTime = 0;
          video.play();
          clearInterval(interval);
          setTimeout(() => {
            video.addEventListener("ended", onVideoEnd);
          }, 3000);
        }
      };
    } else {
      video.addEventListener("ended", onVideoEnd);
    }
  });
}

function onVideoEnd() {
  URL.revokeObjectURL(url);
  window.close();
}