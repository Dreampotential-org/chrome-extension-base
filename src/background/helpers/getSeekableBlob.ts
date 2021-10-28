export function getSeekableBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new window["EBML"].Reader();
    const decoder = new window["EBML"].Decoder();
    const tools = window["EBML"].tools;

    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      const ebmlElms = decoder.decode(this.result);
      ebmlElms.forEach(function (element) {
        reader.read(element);
      });
      reader.stop();
      const refinedMetadataBuf = tools.makeMetadataSeekable(
        reader.metadatas,
        reader.duration,
        reader.cues
      );
      const body = this.result.slice(reader.metadataSize);

      const newBlob = new Blob([refinedMetadataBuf, body], {
        type: "video/webm",
      });

      resolve(newBlob);
    };

    fileReader.readAsArrayBuffer(blob);
  });
}
