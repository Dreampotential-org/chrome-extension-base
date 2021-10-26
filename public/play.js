const url = location.hash.slice(1);
if (url) {
  const video = document.createElement("video");
  video.autoplay = true;
  video.controls = true;
  video.src = url;
  document.body.appendChild(video);

  video.addEventListener("ended", () => {
    URL.revokeObjectURL(url);
    window.close();
  });
}
