export function upload({ blob, signedUrl }, progress: Function, done: Function) {
  let request = new XMLHttpRequest();
  request.open("PUT", signedUrl);
  request.upload.addEventListener("progress", function (e) {
    let percent_completed = (e.loaded / e.total) * 100;
    progress(percent_completed);
  });
  request.addEventListener("load", function (e) {
    done(request, request.response);
  });
  request.send(blob);
}
