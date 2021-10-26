export default class Storage {
  private fs;
  quote: number;
  constructor(quote: number) {
    this.quote = quote;
  }

  init() {
    return new Promise((resolve, reject) => {
      window["webkitRequestFileSystem"](
        1,
        this.quote,
        (fs) => {
          this.fs = fs;
          resolve(this);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  write(
    blob: Blob,
    filename = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fs.root.getFile(
        filename,
        { create: true, exclusive: true },
        function (entry) {
          entry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function (e) {
              resolve(filename);
            };

            fileWriter.onerror = function (e) {
              reject(new Error(e.message));
            };

            fileWriter.write(blob);
          }, console.error);
        },
        console.error
      );
    });
  }

  read(filename: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.fs.root.getFile(
        filename,
        {},
        function (entry) {
          entry.file(
            async function (file) {
              const buffer = await file.arrayBuffer();
              resolve(new Blob([buffer]));
            },
            (e) => reject(e.message)
          );
        },
        (e) => reject(e.message)
      );
      return new Blob([]);
    });
  }

  remove(filename: string) {
    return new Promise((resolve, reject) => {
      this.fs.root.getFile(
        filename,
        { create: false },
        function (fileEntry) {
          fileEntry.remove(
            function () {
              resolve(true);
            },
            (e) => reject(e.message)
          );
        },
        (e) => reject(e.message)
      );
    });
  }
}
