export function upload({ blob }, progress: Function, done: Function) {

  // var data = new FormData();
  // data.append("video", GLOBAL_FILE, GLOBAL_FILE.name);
  // data.append("source", window.location.host);

  let request = new XMLHttpRequest();
  request.open("POST",
	"https://api.dreampotential.org/storage/video-upload/");
  request.upload.addEventListener("progress", function (e) {
    let percent_completed = (e.loaded / e.total) * 100;
    progress(percent_completed);
  });
  request.addEventListener("load", function (e) {
    done(request, request.response);
  });
  request.send(blob);

  request.upload.addEventListener("progress", updateProgress, false);
    request.addEventListener("readystatechange", function () {
	   if (this.readyState === 4) {
		  console.log(this)
		  $("body").append(this.content)
		  if (this.status == 200) {
			 console.log({
				title: "Good job!",
				text: "Video submitted successfully!",
				icon: "success",
			 });
		  } else {
			 console.log({
				title: "Error Try Again",
				text: "Sorry, there is an error please try again later.",
				icon: "error",
				buttons: [true, "Retry"],
			 }).then((retry) => {
				if (retry) {
				  $("#upload").submit();
				}
			 });
		  }
      }
   });
}
