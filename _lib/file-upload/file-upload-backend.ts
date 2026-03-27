import busboy, { Busboy } from "busboy";
import { Readable } from "node:stream";

import fs, { write } from "node:fs";
import path from "node:path";
import { v4 } from "uuid";

export async function headerContentLengthCheck(
  contentLength: string | null,
  MAX_TOTAL_UPLOAD = 5 * 20 * 1024 * 1024,
) {
  console.log(MAX_TOTAL_UPLOAD);
  if (!contentLength) return false;

  const bytes = Number(contentLength);
  if (Number.isNaN(bytes) || bytes <= 0) return false;

  if (bytes > MAX_TOTAL_UPLOAD) return false;

  return true;
}

async function fileCleanup() {}

export async function busboyFilesHandler(
  req: Request,
  limits = {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
) {
  const uploadedFiles: string[] = [];
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
      nodeStream.unpipe(bb);
      returnedInfo.pass = false;
      returnedInfo.error = "Too many files";
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

      const writeStream = fs.createWriteStream(saveTo);

      writeStream.on("error", (err) => {
        console.error("Error while saving the file");

        returnedInfo.pass = false;
        returnedInfo.error =
          "Error while saving the file on writeStream, it's a huge problem with the server";
        reject(returnedInfo);
      });

      file.on("limit", () => {
        writeStream.end();
        fs.unlink(saveTo, (err) => {
          if (err) console.error("error while deleting the file", err);
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

      file.pipe(writeStream);
    });

    bb.on("error", (err) => {
      nodeStream.unpipe(bb);
      returnedInfo.pass = false;
      returnedInfo.error = `Unusual error in Busboy: ${err}`;
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
    });

    const nodeStream = Readable.fromWeb(req.body as any);

    nodeStream.pipe(bb);
  });
}
