import busboy, { Busboy } from "busboy";
import { Readable } from "node:stream";

import fs, { write } from "node:fs";
import path from "node:path";
import { v4 } from "uuid";

export async function headerContentLengthCheck(
  contentLength: string | null,
  MAX_TOTAL_UPLOAD = 5 * 20 * 1024 * 1024,
) {
  if (!contentLength) return false;

  const bytes = Number(contentLength);
  if (Number.isNaN(bytes) || bytes <= 0) return false;

  if (bytes > MAX_TOTAL_UPLOAD) return false;

  return true;
}

export async function busboyFilesHandler(
  req: Request,
  limits = {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
) {
  //paths to the files
  const uploadedFilesPaths: string[] = [];
  const uploadedFilesNames: string[] = [];

  let bb: Busboy;
  const returnedInfo = {
    pass: false,
    message: "",
    status: 500,
    error: "",
  };

  const headers = Object.fromEntries(req.headers);

  try {
    bb = busboy({
      headers,
      limits: limits,
    });
  } catch (err) {
    console.error("Busboy creation error: ", err);
    return returnedInfo;
  }

  return new Promise((resolve, reject) => {
    // check if there isn't too many files
    bb.on("filesLimit", () => {
      console.warn("Too many files");
      nodeStream.unpipe(bb);
      returnedInfo.pass = false;
      returnedInfo.error = "Too many files";
      uploadedFilesPaths.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          console.error("Error while deleting the file:", err);
        });
      });
      reject(returnedInfo);
    });

    // checks every file and if it isn't too big it saves it to the hard drive
    bb.on("file", (name, file, info) => {
      const saveTo = path.join(
        process.cwd(),
        "public",
        "uploads",
        "images",
        `${v4()}-${info.filename}`,
      );

      uploadedFilesPaths.push(saveTo);
      uploadedFilesNames.push(info.filename);

      // the write stream is here
      const writeStream = fs.createWriteStream(saveTo);

      writeStream.on("error", (err) => {
        console.error("Error while saving the file");

        returnedInfo.pass = false;
        returnedInfo.error =
          "Error while saving the file on writeStream, it's a huge problem with the server";
        uploadedFilesPaths.forEach((filePath) => {
          fs.unlink(filePath, (err) => {
            console.error("Error while deleting the file:", err);
          });
        });
        reject(returnedInfo);
      });

      file.on("limit", () => {
        writeStream.end();
        uploadedFilesPaths.forEach((filePath) => {
          fs.unlink(filePath, (err) => {
            console.error("Error while deleting the file:", err);
          });
        });
        // for some reason you still need this line,
        //  so remember that I might prevent memory leaks or something
        // this line sucks it makes you consume the whole request
        // which does problems with bandwith
        // to stop them you have to stop the connection
        // by destroying the socket, but you can't do that
        // normally in next.js
        // but I go with connection close header in response
        // and I hope that it's enough
        file.resume();

        nodeStream.unpipe(bb);
        returnedInfo.pass = false;
        returnedInfo.error = `Too large file ${info.filename}`;
        returnedInfo.status = 413;
        reject(returnedInfo);
      });

      file.on("error", async (err) => {
        console.error("File stream error:", err);
        uploadedFilesPaths.forEach((filePath) => {
          fs.unlink(filePath, (err) => {
            console.error("Error while deleting the file:", err);
          });
        });
        reject(returnedInfo);
      });

      file.pipe(writeStream);
    });

    bb.on("error", (err) => {
      console.log("busboy error happened");
      nodeStream.unpipe(bb);
      returnedInfo.pass = false;
      returnedInfo.error = `Unusual error in Busboy: ${err}`;
      uploadedFilesPaths.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          console.error("Error while deleting the file:", err);
        });
      });
      reject(returnedInfo);
    });

    bb.on("close", () => {
      console.log("bb closed!");
      if (!returnedInfo.error) {
        returnedInfo.pass = true;
        returnedInfo.message = "No errors accured, files should be saved";
        returnedInfo.status = 201;
        resolve(returnedInfo);
      }
      uploadedFilesPaths.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          console.error("Error while deleting the file:", err);
        });
      });
      reject(returnedInfo);
    });

    const nodeStream = Readable.fromWeb(req.body as any);

    req.signal.aborted;

    req.signal.addEventListener("abort", () => {
      console.log(
        "client aborted and we know about it and we can do something about it",
      );
    });

    if (req.signal.aborted) {
    }

    nodeStream.on("close", async () => {
      console.log("Nodestream closed");
      if (!returnedInfo.pass && !returnedInfo.error) {
        console.log("Node stream closed unexpectedly (possible abort)");
        uploadedFilesPaths.forEach((filePath) => {
          fs.unlink(filePath, (err) => {
            console.error("Error while deleting the file:", err);
          });
        });
      }
    });
    nodeStream.pipe(bb);
  });
}
