import busboy, { Busboy } from "busboy";
import { Readable } from "node:stream";
import fs, { write } from "node:fs";
import path from "node:path";
import { v4 } from "uuid";
import { returnedInfoType } from "@/_types/fileUploadTypes";

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

  const returnedInfo: returnedInfoType = {
    pass: false,
    message: "",
    status: 500,
    uploadedFilesNames: [],
    rejectedFiles: [],
    error: "Server error",
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
    function returnError(error: string) {
      if (nodeStream) {
        nodeStream.unpipe(bb);
      }
      if (uploadedFilesPaths.length > 0) {
        uploadedFilesPaths.forEach((filePath) => {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error while deleting the file:", err);
          });
        });
      }

      returnedInfo.pass = false;
      returnedInfo.error = error;
      reject(returnedInfo);
    }
    // check if there isn't too many files
    bb.on("filesLimit", () => {
      console.warn("Too many files");
      returnError("Too many files");
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
        console.error("Error while saving the file", err);
        returnError(
          "Error while saving the file on writeStream, it's a huge problem with the server",
        );
      });

      // Important!!!!!!!!!
      // you don't reject everything instantly if one file is too big,
      //  not a big of a deal but you should be aware of it
      file.on("limit", () => {
        writeStream.end();
        // for some reason you still need this line,
        //  so remember that I might prevent memory leaks or something
        // this line sucks it makes you consume the whole request
        // which does problems with bandwith
        // to stop them you have to stop the connection
        // by destroying the socket, but you can't do that
        // normally in next.js
        // but I go with connection close header in response
        // and I hope that it's enough
        // file.resume();
        // Now we swap the file.resume(); to file.destory() so it destroies the file stream instead of consuming it
        file.destroy();

        returnError(`Too large file ${info.filename}`);
      });

      file.on("error", async (err) => {
        console.error("File stream error:", err);
        returnError(`File stream error ${err}`);
      });

      // piping the file stream to the write stream
      file.pipe(writeStream);
    });

    bb.on("error", (err) => {
      console.log("busboy error happened");
      returnError(`Unusual error in Busboy: ${err}`);
    });

    bb.on("close", () => {
      // technically this doesn't matter cause I should reject the promise before it gets here but okay I gonna leave it for now

      returnedInfo.pass = true;
      returnedInfo.message = "No errors accured, files should be saved";
      returnedInfo.status = 201;
      returnedInfo.uploadedFilesNames = uploadedFilesNames;
      returnedInfo.error = "";
      resolve(returnedInfo);
    });

    const nodeStream = Readable.fromWeb(req.body as any);

    req.signal.addEventListener("abort", () => {
      returnError("Aborted request");
    });

    if (req.signal.aborted) {
    }

    // the pipe of the request stream to the busboy
    nodeStream.pipe(bb);
  });
}
